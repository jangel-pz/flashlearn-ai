-- ============================================================
-- AÑADIR context_summary A decks
-- ============================================================
-- Guarda un resumen muy breve (2-3 frases) del nivel y enfoque del
-- material original de un mazo, generado por la IA en el mismo momento
-- en que se crean las tarjetas (cuando el documento original todavía
-- está disponible en la llamada a la IA).
alter table public.decks
  add column context_summary text not null;

comment on column public.decks.context_summary is
  'Resumen breve (nivel/enfoque) del material original, generado al crear el mazo. Usado como contexto para explicaciones detalladas de tarjetas.';