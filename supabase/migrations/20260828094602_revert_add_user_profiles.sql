-- ============================================================
-- REVERTIR: PERFILES DE USUARIO
-- ============================================================
-- Deshace por completo lo creado en la migración
-- 20260827131334_add_user_profiles.sql
--
-- Orden de borrado:
--   1. El trigger, porque depende de la función
--   2. La función, porque ya no la usa nada
--   3. La tabla, al final: al borrarla, Postgres borra con ella
--      automáticamente sus políticas RLS y los permisos GRANT
--      que le pertenecían.

drop trigger if exists on_auth_user_created on auth.users;

drop function if exists public.handle_new_user();

drop table if exists public.profiles;