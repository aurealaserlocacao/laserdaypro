create or replace function app_private.force_created_by_authenticated_user()
returns trigger
language plpgsql
set search_path = ''
as $function$
begin
  if tg_op = 'UPDATE' then
    new.created_by := old.created_by;
  else
    new.created_by := (select auth.uid());
  end if;
  return new;
end;
$function$;

drop trigger if exists appointments_force_created_by on public.appointments;
create trigger appointments_force_created_by
before insert or update of created_by on public.appointments
for each row execute function app_private.force_created_by_authenticated_user();

drop trigger if exists clinic_expenses_force_created_by on public.clinic_expenses;
create trigger clinic_expenses_force_created_by
before insert or update of created_by on public.clinic_expenses
for each row execute function app_private.force_created_by_authenticated_user();

drop trigger if exists clinic_documents_force_created_by on public.clinic_documents;
create trigger clinic_documents_force_created_by
before insert or update of created_by on public.clinic_documents
for each row execute function app_private.force_created_by_authenticated_user();

drop trigger if exists document_acceptances_force_created_by on public.document_acceptances;
create trigger document_acceptances_force_created_by
before insert or update of created_by on public.document_acceptances
for each row execute function app_private.force_created_by_authenticated_user();
