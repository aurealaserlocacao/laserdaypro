-- Laser Day Pro - initial multi-tenant data model
-- Apply through Supabase migrations. RLS policies intentionally restrict access by clinic membership.

create extension if not exists pgcrypto;

create type public.membership_role as enum ('owner', 'admin', 'professional', 'receptionist');
create type public.appointment_status as enum ('pending_confirmation', 'confirmed', 'in_progress', 'completed', 'no_show', 'canceled');
create type public.payment_status as enum ('pending', 'partial', 'paid', 'refunded');

create table public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  phone text,
  email text,
  timezone text not null default 'America/Sao_Paulo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clinic_members (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.membership_role not null default 'professional',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (clinic_id, user_id)
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  full_name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete restrict,
  starts_at timestamptz not null,
  duration_minutes integer not null default 30 check (duration_minutes between 5 and 600),
  service_name text not null,
  expected_amount numeric(12,2) not null default 0 check (expected_amount >= 0),
  received_amount numeric(12,2) not null default 0 check (received_amount >= 0),
  status public.appointment_status not null default 'pending_confirmation',
  payment_status public.payment_status not null default 'pending',
  internal_notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint appointment_client_same_clinic foreign key (clinic_id, client_id)
    references public.clients(clinic_id, id) deferrable initially immediate
);

create table public.clinic_expenses (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  description text not null,
  category text not null,
  amount numeric(12,2) not null check (amount > 0),
  paid_at date,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.clinic_documents (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  title text not null,
  document_type text not null check (document_type in ('policy', 'pre_care', 'post_care', 'consent', 'other')),
  version integer not null default 1 check (version > 0),
  body text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  unique (clinic_id, document_type, title, version)
);

create table public.document_acceptances (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  document_id uuid not null references public.clinic_documents(id) on delete restrict,
  client_id uuid not null references public.clients(id) on delete restrict,
  accepted_at timestamptz not null default now(),
  acceptance_method text not null default 'in_person',
  evidence_note text,
  created_by uuid references auth.users(id) on delete set null,
  constraint acceptance_client_same_clinic foreign key (clinic_id, client_id)
    references public.clients(clinic_id, id) deferrable initially immediate
);

create index clinic_members_user_active_idx on public.clinic_members(user_id, active);
create index clients_clinic_name_idx on public.clients(clinic_id, full_name);
create index appointments_clinic_start_idx on public.appointments(clinic_id, starts_at);
create index expenses_clinic_paid_idx on public.clinic_expenses(clinic_id, paid_at);
create index acceptances_clinic_client_idx on public.document_acceptances(clinic_id, client_id);

create function public.is_clinic_member(target_clinic uuid)
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.clinic_members m
    where m.clinic_id = target_clinic
      and m.user_id = (select auth.uid())
      and m.active = true
  );
$$;

create function public.has_clinic_role(target_clinic uuid, allowed_roles public.membership_role[])
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1 from public.clinic_members m
    where m.clinic_id = target_clinic
      and m.user_id = (select auth.uid())
      and m.active = true
      and m.role = any(allowed_roles)
  );
$$;

alter table public.clinics enable row level security;
alter table public.clinic_members enable row level security;
alter table public.clients enable row level security;
alter table public.appointments enable row level security;
alter table public.clinic_expenses enable row level security;
alter table public.clinic_documents enable row level security;
alter table public.document_acceptances enable row level security;

create policy "members can read own clinics" on public.clinics
for select to authenticated using (public.is_clinic_member(id));
create policy "clinic admins can update clinic" on public.clinics
for update to authenticated using (public.has_clinic_role(id, array['owner','admin']::public.membership_role[]))
with check (public.has_clinic_role(id, array['owner','admin']::public.membership_role[]));

create policy "members can read clinic memberships" on public.clinic_members
for select to authenticated using (public.is_clinic_member(clinic_id));
create policy "owners and admins manage memberships" on public.clinic_members
for all to authenticated using (public.has_clinic_role(clinic_id, array['owner','admin']::public.membership_role[]))
with check (public.has_clinic_role(clinic_id, array['owner','admin']::public.membership_role[]));

create policy "members read clients" on public.clients
for select to authenticated using (public.is_clinic_member(clinic_id));
create policy "clinic team creates clients" on public.clients
for insert to authenticated with check (public.has_clinic_role(clinic_id, array['owner','admin','professional','receptionist']::public.membership_role[]));
create policy "clinic team updates clients" on public.clients
for update to authenticated using (public.has_clinic_role(clinic_id, array['owner','admin','professional','receptionist']::public.membership_role[]))
with check (public.has_clinic_role(clinic_id, array['owner','admin','professional','receptionist']::public.membership_role[]));

create policy "members read appointments" on public.appointments
for select to authenticated using (public.is_clinic_member(clinic_id));
create policy "clinic team creates appointments" on public.appointments
for insert to authenticated with check (public.has_clinic_role(clinic_id, array['owner','admin','professional','receptionist']::public.membership_role[]));
create policy "clinic team updates appointments" on public.appointments
for update to authenticated using (public.has_clinic_role(clinic_id, array['owner','admin','professional','receptionist']::public.membership_role[]))
with check (public.has_clinic_role(clinic_id, array['owner','admin','professional','receptionist']::public.membership_role[]));

create policy "admins read expenses" on public.clinic_expenses
for select to authenticated using (public.has_clinic_role(clinic_id, array['owner','admin']::public.membership_role[]));
create policy "admins manage expenses" on public.clinic_expenses
for all to authenticated using (public.has_clinic_role(clinic_id, array['owner','admin']::public.membership_role[]))
with check (public.has_clinic_role(clinic_id, array['owner','admin']::public.membership_role[]));

create policy "members read clinic documents" on public.clinic_documents
for select to authenticated using (public.is_clinic_member(clinic_id));
create policy "admins manage clinic documents" on public.clinic_documents
for all to authenticated using (public.has_clinic_role(clinic_id, array['owner','admin']::public.membership_role[]))
with check (public.has_clinic_role(clinic_id, array['owner','admin']::public.membership_role[]));

create policy "members read acceptances" on public.document_acceptances
for select to authenticated using (public.is_clinic_member(clinic_id));
create policy "team records acceptances" on public.document_acceptances
for insert to authenticated with check (public.has_clinic_role(clinic_id, array['owner','admin','professional','receptionist']::public.membership_role[]));
