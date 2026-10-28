create policy "admins read expenses" on public.clinic_expenses
 for select to authenticated
 using (app_private.has_clinic_role(clinic_id, array['owner'::public.membership_role,'admin'::public.membership_role]));
