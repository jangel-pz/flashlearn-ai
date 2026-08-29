-- =======================================================
-- PERMISOS BASE (GRANTS) PARA LAS TABLAS
-- =======================================================
-- Permisos para roles "anon" y "authenticated"

-- Permite a los roles ver que el esquema public existe y
-- resolver los nombres de las tablas dentro de rl.
grant usage on schema public to anon, authenticated;

-- Usuarios "authenticated": necesitan poder leer,
-- crear, actualizar y borrar
grant select, insert, update, delete on public.decks to authenticated;
grant select, insert, update, delete on public.cards to authenticated;
grant select, insert, update, delete on public.card_explanations to authenticated;
grant select, insert, update, delete on public.quiz_questions to authenticated;

-- Usuarios "anon": en esta app nadie sin login
-- debe ver ni modificar nada
grant select on public.decks to anon;
grant select on public.cards to anon;
grant select on public.card_explanations to anon;
grant select on public.quiz_questions to anon;