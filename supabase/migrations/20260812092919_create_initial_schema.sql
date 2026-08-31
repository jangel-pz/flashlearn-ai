-- ===================================================================
-- ESQUEMA DE BASE DE DATOS - App FlashLearnAI
-- ===================================================================
-- Nota: no hace falta crear tabla de "usuarios", Supabase ya
-- gestiona eso en auth.users automaticamente al hacer login/registro.

-- Extensión para generar IDs unicos (UUID)
create extension if not exists pgcrypto;

-- =============================================================================
-- DECKS (Mazos de tarjetas)
-- =============================================================================
-- Cada fila es un mazo creado por un usuario a partir de un archivo de apuntes.
create table public.decks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.decks is 'Mazos de estudio creados por cada usuario';

-- =========================================================================
-- CARDS (Tarjetas de estudio dentro de un mazo)
-- =========================================================================
-- Cada fila es una tarjeta con su pregunta, respuesta y progreso de estudio.
create table public.cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references public.decks(id) on delete cascade,
  question text not null,
  answer text not null,
  position integer not null default 0, -- orden de la tarjeta dentro del mazo

  -- Progreso de estudio (se actualiza cada vez que el usuario intenta
  -- un cuestionario)
  times_correct integer not null default 0,
  times_incorrect integer not null default 0,
  last_reviewed_at timestamptz,

  created_at timestamptz not null default now()
);

comment on table public.cards is 'Tarjetas individuales (pregunta/respuesta) de cada mazo';

-- =================================================================
-- CARD_EXPLANATIONS (Explicaciones detalladas de conceptos)
-- =================================================================
-- Guarda la explicacion/analogia generada cuando el usuario pulsa
-- "Explicar mas a fondo"
create table public.card_explanations (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  explanation text not null,
  created_at timestamptz not null default now()
);

comment on table public.card_explanations is 'Explicaciones extra generadas por la IA cuando el usuario falla una tarjeta';

-- ========================================================================
-- QUIZ_QUESTIONS (Preguntas tipo test sobre tarjetas)
-- ========================================================================
-- Cada tarjeta puede generar una pregunta de opción multiple para el quiz.
create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.cards(id) on delete cascade,
  question_text text not null,

  -- array con las 4 opciones, ej: ["a", "b", "c", "d"]
  options jsonb not null,

  -- indice (0 a 3) de la opcion correcta dentro de "options"
  correct_option smallint not null,

  created_at timestamptz not null default now()
);

comment on table public.quiz_questions is 'Preguntas de opción múltiple generadas a partir de las tarjetas';

-- ======================================================================
-- INDICES
-- ======================================================================
create index idx_decks_user_id on public.decks(user_id);
create index idx_cards_deck_id on public.cards(deck_id);
create index idx_explanations_card_id on public.card_explanations(card_id);
create index idx_quiz_questions_card_id on public.quiz_questions(card_id);

-- ==============================================================
-- ACTUALIZAR "updated_at" AUTOMATICAMENTE
-- ==============================================================
-- Esta funcion se ejecuta sola cada vez que se modifica un mazo.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_decks_updated_at
before update on public.decks
for each row execute function public.set_updated_at();

-- ================================================
-- SEGURIDAD: ROW LEVEL SECURITY (RLS)
-- ================================================
-- Cada fila solo es visible/editable por su dueño.

alter table public.decks enable row level security;
alter table public.cards enable row level security;
alter table public.card_explanations enable row level security;
alter table public.quiz_questions enable row level security;

-- --- Politica para DECKS: el usuario solo ve/edita sus propios mazos ---
create policy "Los usuarios gestionan sus propios mazos"
on public.decks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- --- Politica para CARDS: solo si el mazo al que pertenece es suyo ---
create policy "Los usuarios gestionan las tarjetas de sus mazos"
on public.cards
for all
using (
  exists (
    select 1 from public.decks
    where decks.id = cards.deck_id
    and decks.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.decks
    where decks.id = cards.deck_id
    and decks.user_id = auth.uid()
  )
);

-- --- Politica para CARD_EXPLANATIONS: solo si la tarjeta es suya ---
create policy "Los usuarios gestionan las explicaciones de sus tarjetas"
on public.card_explanations
for all
using (
  exists (
    select 1 from public.cards
    join public.decks on decks.id = cards.deck_id
    where cards.id = card_explanations.card_id
    and decks.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.cards
    join public.decks on decks.id = cards.deck_id
    where cards.id = card_explanations.card_id
    and decks.user_id = auth.uid()
  )
);

-- --- Politica para QUIZ_QUESTIONS: solo si la tarjeta es suya ---
create policy "Los usuarios gestionan las preguntas de sus tarjetas"
on public.quiz_questions
for all
using (
  exists (
    select 1 from public.cards
    join public.decks on decks.id = cards.deck_id
    where cards.id = quiz_questions.card_id
    and decks.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.cards
    join public.decks on decks.id = cards.deck_id
    where cards.id = quiz_questions.card_id
    and decks.user_id = auth.uid()
  )
);
