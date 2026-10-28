-- Platform master administrator allowlist.
-- The account is provisioned only when the exact allowlisted email creates an Auth user.
create table app_private.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

revoke all on table app_private.platform_admins from public, anon, authenticated;

create function app_private.provision_platform_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if lower(coalesce(new.email, '')) = 'aurealaserlocacao@gmail.com' then
    insert into app_private.platform_admins (user_id, email)
    values (new.id, lower(new.email))
    on conflict (user_id) do update set email = excluded.email;
  end if;
  return new;
end;
$$;

revoke all on function app_private.provision_platform_admin() from public, anon, authenticated;

create trigger provision_laser_day_platform_admin
after insert on auth.users
for each row execute function app_private.provision_platform_admin();

create function app_private.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from app_private.platform_admins p
    where p.user_id = (select auth.uid())
  );
$$;

revoke all on function app_private.is_platform_admin() from public, anon;
grant execute on function app_private.is_platform_admin() to authenticated;
