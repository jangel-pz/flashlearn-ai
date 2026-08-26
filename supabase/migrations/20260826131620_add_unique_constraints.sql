-- ====================
-- RESTRICCIONES UNIQUE
-- ====================
-- Por diseño, solo debe existir como mucho una explicación y
-- una pregunta de test por tarjeta. Se fuerza esa regla
-- directamente en la base de datos marcando los campos
-- correspondientes como unique, ya que el código de la aplicación
-- no puede evitar una condición de carrera por sí solo.

-- Como mucho una explicación guardada por tarjeta
alter table public.card_explanations
  add constraint card_explanations_card_id_key unique (card_id);

-- Como mucho una pregunta de test guardada por tarjeta
alter table public.quiz_questions
  add constraint quiz_questions_card_id_key unique (card_id);