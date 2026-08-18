-- ============================================================
-- RPC: registrar resultados de un intento de cuestionario
-- ============================================================
-- Recibe un array de resultados (uno por tarjeta respondida) y
-- actualiza times_correct / times_incorrect de forma atómica en
-- una sola instrucción, evitando condiciones de carrera
--
-- Se define SIN "security definer", es decir, se ejecuta con los
-- permisos del usuario que la llama (el valor por defecto): significa que un usuario
-- solo puede actualizar tarjetas de sus propios mazos
create or replace function public.register_quiz_results(p_results jsonb)
returns void
language sql
as $$
  update public.cards as c
  set
    times_correct = c.times_correct
      + case when r.correct then 1 else 0 end,
    times_incorrect = c.times_incorrect
      + case when r.correct then 0 else 1 end,
    last_reviewed_at = now()
  from jsonb_to_recordset(p_results) as r(card_id uuid, correct boolean)
  where c.id = r.card_id;
$$;

comment on function public.register_quiz_results is
  'Actualiza de forma atómica times_correct/times_incorrect/last_reviewed_at de varias tarjetas a la vez, a partir de los resultados de un intento de cuestionario. p_results: [{"card_id": "...", "correct": true}, ...]';

-- Hay que autorizar explícitamente a los usuarios logueados a ejecutar esta función.
grant execute on function public.register_quiz_results(jsonb) to authenticated;