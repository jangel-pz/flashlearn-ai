import { notFound, redirect } from "next/navigation";
import { BackLink, QuizPlayer } from "@/components";
import { createClient } from "@/lib/supabase/server";
import { shuffleQuiz } from "@/lib/utils/quizShuffle";

export default async function QuizPage({ params, searchParams }) {
  const { id } = await params;
  const { cards: cardsParam } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select("id, title")
    .eq("id", id)
    .single();

  if (deckError || !deck) {
    notFound();
  }

  // Si las tarjetas elegidas para este intento no son validas, se redirige al usuario para empezar un intento nuevo.
  const requestedCardIds = (cardsParam ?? "").split(",").filter(Boolean);

  if (requestedCardIds.length === 0) {
    redirect(
      `/decks/${id}?type=error&message=` +
        encodeURIComponent(
          "Pulsa 'Hacer cuestionario' para empezar un intento",
        ),
    );
  }

  // Cada carta junto con su pregunta de test (si ya existe).
  /*
  IMPORTANTE: En consultas anidadas como esta, PostgREST (motor que genera API automatica en Supabase) decide automáticamente si la relación es "uno a muchos" (devuelve un array) o "uno a uno" (devuelve un objeto). Si hay una restricción unique en la clave foránea se detecta relacion "uno a uno"
   */
  const { data: cards, error: cardsError } = await supabase
    .from("cards")
    .select("id, quiz_questions(question_text, options, correct_option)")
    .eq("deck_id", id)
    .in("id", requestedCardIds);

  if (cardsError) {
    console.error(cardsError);
  }

  // Si algun id pedido en la URL no pertenece al mazo o no tiene pregunta guardada se redirige al usuario para empezar un intento nuevo y correcto.
  const validCards = (cards ?? []).filter((card) => card.quiz_questions);

  if (validCards.length !== requestedCardIds.length) {
    redirect(
      `/decks/${id}?type=error&message=` +
        encodeURIComponent(
          "Ese cuestionario ya no está disponible, empieza uno nuevo",
        ),
    );
  }

  const questions = cards.map((card) => {
    const q = card.quiz_questions;
    return {
      cardId: card.id,
      questionText: q.question_text,
      options: q.options,
      correctOption: q.correct_option,
    };
  });

  // El barajado se calcula en el servidor una sola vez por peticion. Así el orden se mantiene estable mientras el usuario responde el cuestionario.
  const shuffledQuestions = shuffleQuiz(questions);

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href={`/decks/${id}`}>← Volver al mazo</BackLink>

      <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
        Cuestionario: {deck.title}
      </h1>

      <QuizPlayer questions={shuffledQuestions} />
    </div>
  );
}
