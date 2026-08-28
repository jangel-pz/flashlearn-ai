-- ===================
-- PERFILES DE USUARIO
-- ===================
-- Como Supabase gestiona la información de los usuarios
-- internamente en auth.users no se puede modificar directamente
-- la información que se guarda de ellos. Por ello, se crea una
-- tabla auxiliar que almacena los username de los usuarios de
-- la aplicación y que apunta a auth.users a través del id de
-- usuario correspondiente
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  created_at timestamptz not null default now()
);

-- Se activa RLS en la nueva tabla para que los usuarios sólo
-- tengan acceso a su propio perfil
alter table public.profiles enable row level security;

create policy "Los usuarios ven su propio perfil"
on public.profiles for select
using (auth.uid() = id);

create policy "Los usuarios actualizan su propio perfil"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- Se activan permisos GRANT
grant select, update on public.profiles to authenticated;

-- Trigger que crea el perfil automáticamente cuando se registra
-- un usuario nuevo, leyendo el username en el metadata del signUp()
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();