"use server";

import { redirect } from "next/navigation";
import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";
import { quizGenerationSchema } from "@/lib/ai/schemas";

// Numero de preguntas por intento de cuestionario. Se eligen al azar en cada intento y ahorran uso de IA las primeras veces
const QUESTIONS_PER_ATTEMPT = 10;

export async function createQuiz(deckId) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // En este punto solo se necesitan los ids de las tarjetas para comprobar si ya tienen preguntas guardadas
  const { data: cards, error: cardsError } = await supabase
    .from("cards")
    .select("id")
    .eq("deck_id", deckId);

  if (cardsError || !cards || cards.length === 0) {
    console.error(
      "Error obteniendo tarjetas para el cuestionario:",
      cardsError,
    );
    redirect(
      `/decks/${deckId}?type=error&message=` +
        encodeURIComponent("No se pudo generar el cuestionario"),
    );
  }

  // Eleccion de tarjetas/preguntas al azar para este intento
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  const attemptCardIds = shuffled
    .slice(0, QUESTIONS_PER_ATTEMPT)
    .map((c) => c.id);

  // Comprobacion de cartas que ya tienen su pregunta de test guardada para no volver a gastar cuota de IA en ellas y como proteccion por si la IA no genero alguna la vez anterior
  const { data: existing, error: existingError } = await supabase
    .from("quiz_questions")
    .select("card_id")
    .in("card_id", attemptCardIds);

  if (existingError) {
    console.error("Error consultando cuestionario:", existingError);
  }

  const existingCardIds = new Set((existing ?? []).map((q) => q.card_id));
  const cardsNeedingQuestion = attemptCardIds.filter(
    (cardId) => !existingCardIds.has(cardId),
  );

  // Si faltan preguntas, se generan todas en una sola llamada a la IA
  if (cardsNeedingQuestion.length > 0) {
    const { data: fullCards, error: fullCardsError } = await supabase
      .from("cards")
      .select("id, question, answer")
      .in("id", cardsNeedingQuestion);

    if (fullCardsError || !fullCards) {
      console.error(
        "Error obteniendo tarjetas para el cuestionario:",
        fullCardsError,
      );
      redirect(
        `/decks/${deckId}?type=error&message=` +
          encodeURIComponent("No se pudo generar el cuestionario"),
      );
    }

    let generatedQuestions;
    try {
      const result = await generateText({
        model: google("gemini-3.5-flash-lite"),
        output: Output.object({ schema: quizGenerationSchema }),
        messages: [
          {
            role: "user",
            content:
              "A partir de las siguientes tarjetas de pregunta/respuesta, genera una pregunta de tipo test (4 opciones, solo una correcta) para cada tarjeta. La opción correcta debe reflejar fielmente la respuesta original. Las 3 opciones incorrectas deben ser plausibles pero claramente erróneas, sobre el mismo tema. Devuelve el 'card_id' de cada tarjeta exactamente como se indica abajo, sin modificarlo.\n\n" +
              cardsNeedingQuestion
                .map(
                  (c) =>
                    `card_id: ${c.id}\nPregunta original: ${c.question}\nRespuesta original: ${c.answer}`,
                )
                .join("\n\n"),
          },
        ],
      });
      ({ questions: generatedQuestions } = result.output);
    } catch (error) {
      console.error("Error generando el cuestionario con IA:", error);
      redirect(
        `/decks/${deckId}?type=error&message=` +
          encodeURIComponent("No se pudo generar el cuestionario"),
      );
    }

    // Insercion de preguntas cuyo card_id corresponde de verdad a una carta que esperada (protección ante ids inventados por la IA).
    const validCardIds = new Set(cardsNeedingQuestion);
    const questionsToInsert = generatedQuestions
      .filter((q) => validCardIds.has(q.card_id))
      .map((q) => ({
        card_id: q.card_id,
        question_text: q.question_text,
        options: q.options,
        correct_option: q.correct_option,
      }));

    if (questionsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from("quiz_questions")
        .insert(questionsToInsert);

      if (insertError) {
        console.error("Error guardando el cuestionario:", insertError);
        redirect(
          `/decks/${deckId}?type=error&message=` +
            encodeURIComponent("No se pudo guardar el cuestionario"),
        );
      }
    }
  }

  // Las tarjetas/preguntas del intento actual se pasan a la pagina del cuestionario como parametros en la URL
  redirect(`/decks/${deckId}/quiz?cards=${attemptCardIds.join(",")}`);
}
