alter table public.clinic_documents
  drop constraint if exists clinic_documents_document_type_check;

alter table public.clinic_documents
  add constraint clinic_documents_document_type_check
  check (document_type = any (array['policy','pre_care','post_care','consent','other','contract']::text[]));

create or replace function app_private.force_created_by_authenticated_user()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  new.created_by := (select auth.uid());
  return new;
end;
$function$;

revoke all on function app_private.force_created_by_authenticated_user() from public, anon, authenticated;

drop trigger if exists appointments_force_created_by on public.appointments;
create trigger appointments_force_created_by
before insert on public.appointments
for each row execute function app_private.force_created_by_authenticated_user();

drop trigger if exists clinic_expenses_force_created_by on public.clinic_expenses;
create trigger clinic_expenses_force_created_by
before insert on public.clinic_expenses
for each row execute function app_private.force_created_by_authenticated_user();

drop trigger if exists clinic_documents_force_created_by on public.clinic_documents;
create trigger clinic_documents_force_created_by
before insert on public.clinic_documents
for each row execute function app_private.force_created_by_authenticated_user();

drop trigger if exists document_acceptances_force_created_by on public.document_acceptances;
create trigger document_acceptances_force_created_by
before insert on public.document_acceptances
for each row execute function app_private.force_created_by_authenticated_user();
