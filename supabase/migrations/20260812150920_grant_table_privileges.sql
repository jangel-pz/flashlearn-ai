-- ============================================================
-- PERMISOS BASE (GRANTS) PARA LAS TABLAS
-- ============================================================
-- Desde mayo de 2026, Supabase ya NO concede automáticamente
-- permisos de acceso a las tablas nuevas para los roles "anon"
-- (usuario no logueado) y "authenticated" (usuario logueado).
--
-- Importante: esto es una capa DISTINTA a RLS.
--   - GRANT   = "¿puede este rol intentar consultar la tabla?"
--   - RLS     = "de las filas de la tabla, ¿cuáles puede ver?"
-- Sin el GRANT, Postgres ni siquiera deja intentar la consulta
-- (error 42501). Con el GRANT pero sin políticas RLS adecuadas,
-- la consulta se ejecuta pero no devuelve ninguna fila.
-- Necesitamos AMBAS capas para que la app funcione como se espera.

-- Permite a los roles "ver" que el esquema public existe y
-- resolver los nombres de las tablas dentro de él.
grant usage on schema public to anon, authenticated;

-- "authenticated" = usuarios logueados: necesitan poder leer,
-- crear, actualizar y borrar (RLS seguirá limitándolo a SUS
-- propios mazos/tarjetas, nunca a los de otros usuarios).
grant select, insert, update, delete on public.decks to authenticated;
grant select, insert, update, delete on public.cards to authenticated;
grant select, insert, update, delete on public.card_explanations to authenticated;
grant select, insert, update, delete on public.quiz_questions to authenticated;

-- "anon" = usuario sin sesión iniciada: en esta app nadie sin
-- login debería ver ni modificar nada, así que solo damos SELECT
-- (para que la consulta se pueda intentar) y RLS se encarga de
-- que el resultado sean siempre 0 filas.
grant select on public.decks to anon;
grant select on public.cards to anon;
grant select on public.card_explanations to anon;
grant select on public.quiz_questions to anon;