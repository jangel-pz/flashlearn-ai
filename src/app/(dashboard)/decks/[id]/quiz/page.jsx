import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { QuizPlayer } from "@/components/QuizPlayer";

export default async function QuizPage({ params }) {
  const { id } = await params;
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

  // Cada carta junto con su pregunta de test (si ya existe)
  const { data: cards, error: cardsError } = await supabase
    .from("cards")
    .select(
      "id, position, quiz_questions(question_text, options, correct_option)",
    )
    .eq("deck_id", id)
    .order("position");

  if (cardsError) {
    console.error(cardsError);
  }

  // Si el cuestionario todavía no se ha generado se redirige al usuario pulse el botón de generarlo.
  const missingQuestions =
    !cards ||
    cards.length === 0 ||
    cards.some(
      (card) => !card.quiz_questions || card.quiz_questions.length === 0,
    );

  if (missingQuestions) {
    redirect(
      `/decks/${id}?error=` +
        encodeURIComponent(
          "Genera primero el cuestionario con el botón 'Hacer cuestionario'",
        ),
    );
  }

  const questions = cards.map((card) => {
    const q = card.quiz_questions[0];
    return {
      cardId: card.id,
      questionText: q.question_text,
      options: q.options,
      correctOption: q.correct_option,
    };
  });

  return (
    <div className="max-w-2xl my-12 mx-auto p-6">
      <Link href={`/decks/${id}`} className="text-sm text-gray-500">
        ← Volver al mazo
      </Link>

      <h1 className="mt-2">Cuestionario: {deck.title}</h1>

      <QuizPlayer questions={questions} />
    </div>
  );
}
