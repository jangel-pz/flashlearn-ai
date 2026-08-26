"use server";

import { redirect } from "next/navigation";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";

export async function explainCard(cardId) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Si ya hay una explicacion guardada no se llama a la API de Gemini
  const { data: cached, error: cachedError } = await supabase
    .from("card_explanations")
    .select("explanation")
    .eq("card_id", cardId)
    .maybeSingle();

  if (cachedError) {
    console.error("Error consultando caché de explicaciones:", cachedError);
  }

  if (cached) {
    return { explanation: cached.explanation };
  }

  // Si no hay explicacion guardada se le pasa a la API de Gemini el titulo del mazo y el de la tarjeta mas el par pregunta/respuesta como contexto
  const { data: card, error: cardError } = await supabase
    .from("cards")
    .select("question, answer, decks(title, context_summary)")
    .eq("id", cardId)
    .single();

  if (cardError || !card) {
    console.error("Error obteniendo la tarjeta:", cardError);
    return { error: "No se encontró la tarjeta" };
  }

  const deckTitle = card.decks?.title ?? "";
  const contextSummary = card.decks?.context_summary;

  let explanation;
  try {
    const result = await generateText({
      model: google("gemini-3.5-flash-lite"),
      messages: [
        {
          role: "user",
          content:
            `Mazo de estudio: "${deckTitle}".\n` +
            (contextSummary
              ? `Contexto del material original (nivel/enfoque): ${contextSummary}\n`
              : "") +
            `\nPregunta: ${card.question}\n` +
            `Respuesta breve actual: ${card.answer}\n\n` +
            "Explica este concepto con más detalle: añade contexto, algún ejemplo o analogía que ayude a entenderlo mejor. Mantén el mismo nivel y enfoque que el material original indicado arriba. Responde en 2-4 párrafos, en español, sin repetir literalmente la pregunta.",
        },
      ],
    });
    explanation = result.text;
  } catch (error) {
    console.error("Error generando la explicación con IA:", error);
    return {
      error: "No se pudo generar la explicación.",
    };
  }

  // Se guarda la explicacion para no tener que generarla de nuevo la proxima vez. Se usa upsert() con ignoreDuplicates en vez de insert() para que los posibles duplicados se ignoren silenciosamente
  const { error: insertError } = await supabase
    .from("card_explanations")
    .upsert(
      { card_id: cardId, explanation },
      { onConflict: "card_id", ignoreDuplicates: true },
    );

  if (insertError) {
    console.error("Error guardando la explicación en caché:", insertError);
  }

  return { explanation };
}
