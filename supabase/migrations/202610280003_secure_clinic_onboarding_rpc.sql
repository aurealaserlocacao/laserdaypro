create or replace function public.create_clinic_for_current_user(clinic_name text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  new_clinic_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if clinic_name is null or length(trim(clinic_name)) < 2 or length(trim(clinic_name)) > 120 then
    raise exception 'Clinic name must contain between 2 and 120 characters';
  end if;

  insert into public.clinics (name)
  values (trim(clinic_name))
  returning id into new_clinic_id;

  insert into public.clinic_members (clinic_id, user_id, role, active)
  values (new_clinic_id, current_user_id, 'owner', true);

  return new_clinic_id;
end;
$$;

revoke all on function public.create_clinic_for_current_user(text) from public, anon;
grant execute on function public.create_clinic_for_current_user(text) to authenticated;
