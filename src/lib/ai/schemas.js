import { z } from "zod";

export const deckExtractionSchema = z.object({
  title: z
    .string()
    .describe(
      "Título breve (máximo 10 palabras) que resuma el tema principal del contenido",
    ),
  context_summary: z
    .string()
    .describe(
      "Resumen de 2-3 frases sobre el NIVEL y ENFOQUE del contenido original (p. ej. 'apuntes universitarios introductorios sobre biología celular, con enfoque en mecanismos y terminología técnica'). No repitas el contenido en sí, solo el tono/nivel/enfoque. Esto se usará más adelante para generar explicaciones adicionales en el mismo estilo, sin volver a consultar el archivo original.",
    ),
  cards: z
    .array(
      z.object({
        question: z
          .string()
          .describe(
            "Una pregunta clara sobre un único concepto clave del contenido",
          ),
        answer: z
          .string()
          .describe(
            "La respuesta correcta y completa, basada solo en el contenido proporcionado",
          ),
      }),
    )
    .min(5)
    .max(20)
    .describe(
      "Tarjetas de estudio pregunta/respuesta. Evita preguntas triviales o ambiguas.",
    ),
});
