-- Replace broad ALL policies with explicit write policies to avoid duplicate SELECT policies.
drop policy if exists "admins manage clinic documents" on public.clinic_documents;
create policy "admins insert clinic documents" on public.clinic_documents for insert to authenticated
  with check (app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]));
create policy "admins update clinic documents" on public.clinic_documents for update to authenticated
  using (app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]))
  with check (app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]));
create policy "admins delete clinic documents" on public.clinic_documents for delete to authenticated
  using (app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]));

drop policy if exists "admins manage expenses" on public.clinic_expenses;
drop policy if exists "admins read expenses" on public.clinic_expenses;
create policy "admins insert expenses" on public.clinic_expenses for insert to authenticated
  with check (app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]));
create policy "admins update expenses" on public.clinic_expenses for update to authenticated
  using (app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]))
  with check (app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]));
create policy "admins delete expenses" on public.clinic_expenses for delete to authenticated
  using (app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]));

drop policy if exists "owners and admins manage non-owner memberships" on public.clinic_members;
create policy "admins insert non-owner memberships" on public.clinic_members for insert to authenticated
  with check (role <> 'owner'::public.membership_role and app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]));
create policy "admins update non-owner memberships" on public.clinic_members for update to authenticated
  using (role <> 'owner'::public.membership_role and app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]))
  with check (role <> 'owner'::public.membership_role and app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]));
create policy "admins delete non-owner memberships" on public.clinic_members for delete to authenticated
  using (role <> 'owner'::public.membership_role and app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]));

create index if not exists appointments_clinic_client_idx on public.appointments (clinic_id, client_id);
create index if not exists appointments_created_by_idx on public.appointments (created_by);
create index if not exists clinic_documents_created_by_idx on public.clinic_documents (created_by);
create index if not exists clinic_expenses_created_by_idx on public.clinic_expenses (created_by);
create index if not exists document_acceptances_clinic_document_idx on public.document_acceptances (clinic_id, document_id);
create index if not exists document_acceptances_created_by_idx on public.document_acceptances (created_by);
create index if not exists allowed_signup_emails_created_by_idx on app_private.allowed_signup_emails (created_by);
