-- ============================================================
-- REVERTIR: PERFILES DE USUARIO
-- ============================================================
-- Deshace por completo los cambios en la migracion
-- 20260827131334_add_user_profiles.sql

drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user();

drop table if exists public.profiles;