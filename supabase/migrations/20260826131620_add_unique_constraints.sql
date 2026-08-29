-- ==========================================================
-- RESTRICCIONES UNIQUE
-- ==========================================================
-- Por diseño, solo debe existir como mucho una explicacion y
-- una pregunta de test por tarjeta. Se fuerza esa regla
-- directamente en la base de datos marcando los campos
-- correspondientes como unique.

-- Como mucho una explicacion guardada por tarjeta
alter table public.card_explanations
  add constraint card_explanations_card_id_key unique (card_id);

-- Como mucho una pregunta de test guardada por tarjeta
alter table public.quiz_questions
  add constraint quiz_questions_card_id_key unique (card_id);