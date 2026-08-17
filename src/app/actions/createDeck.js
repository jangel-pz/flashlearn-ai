"use server";

import { redirect } from "next/navigation";
import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";
import { deckExtractionSchema } from "@/lib/ai/schemas";

// Límite defensivo: Gemini acepta archivos "inline" hasta cierto tamaño
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export async function generateDeckFromFiles(formData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // formData.getAll porque el input permite subir varios archivos a la vez.
  const files = formData.getAll("files").filter((f) => f && f.size > 0);

  if (files.length === 0) {
    redirect("/decks/new?error=" + encodeURIComponent("Sube un archivo"));
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      redirect(
        "/decks/new?error=" +
          encodeURIComponent(
            `El archivo "${file.name}" supera el límite de ${MAX_FILE_SIZE_MB}MB`,
          ),
      );
    }
  }

  // El modelo recibe el PDF o imagen tal cual y lo interpreta.
  const fileParts = await Promise.all(
    files.map(async (file) => ({
      type: "file",
      data: Buffer.from(await file.arrayBuffer()),
      mediaType: file.type || "application/pdf",
    })),
  );

  let title, context_summary, cards;
  try {
    const result = await generateText({
      model: google("gemini-3.5-flash-lite"),
      output: Output.object({ schema: deckExtractionSchema }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Analiza el contenido de los siguientes archivos y genera un mazo de " +
                "tarjetas de estudio (pregunta/respuesta) que cubra los conceptos clave. " +
                "Basa las preguntas y respuestas únicamente en la información de los " +
                "archivos, sin inventar datos que no aparezcan en ellos.",
            },
            ...fileParts,
          ],
        },
      ],
    });
    ({ title, context_summary, cards } = result.output);
  } catch (error) {
    // Errores de red/API (p. e. cuota gratuita agotada) y errores del modelo de IA
    console.error("Error generando el mazo con IA:", error);
    redirect(
      "/decks/new?error=" + encodeURIComponent("No se pudo generar el mazo"),
    );
  }

  // Nombres de archivo en source_text a modo de referencia
  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .insert({
      user_id: user.id,
      title,
      context_summary,
      source_text: files.map((f) => f.name).join(", "),
    })
    .select()
    .single();

  if (deckError) {
    console.error(deckError);
    redirect(
      "/decks/new?error=" + encodeURIComponent("No se pudo guardar el mazo"),
    );
  }

  const cardsToInsert = cards.map((card, index) => ({
    deck_id: deck.id,
    question: card.question,
    answer: card.answer,
    position: index,
  }));

  const { error: cardsError } = await supabase
    .from("cards")
    .insert(cardsToInsert);

  if (cardsError) {
    console.error(cardsError);
    redirect(
      "/decks/new?error=" +
        encodeURIComponent("No se pudieron guardar las cartas"),
    );
  }

  redirect(`/decks/${deck.id}`);
}
