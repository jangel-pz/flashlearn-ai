import { z } from "zod";

/**
 * Esquema para generar mazos de tarjetas de estudio con IA. Se
 * solicitan entre 5 y 20 pares pregunta/respuesta claros y no
 * triviales sobre contenidos que deben aparecen explicitamente
 * en los archivos de apuntes enviados
 */
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

/**
 * Esquema para generar preguntas de test a partir de tarjetas
 * con IA. Se solicita el identificador de cada pregunta para
 * emparejarla con la tarjeta correcta sin depender del orden de
 * respuesta y verificar que no hay preguntas inventadas o
 * alucinaciones. Las preguntas generadas deben estar clara y
 * directamente relacionadas con el contenido de su tarjeta y
 * las opciones de respuesta deben ser todas verosimiles, aunque
 * una debe ser inequivocamente correcta
 */
export const quizGenerationSchema = z.object({
  questions: z
    .array(
      z.object({
        card_id: z
          .string()
          .describe(
            "El id exacto de la tarjeta indicado en el prompt (cópialo tal cual, sin modificarlo)",
          ),
        question_text: z
          .string()
          .describe(
            "Pregunta de tipo test basada en la tarjeta original (puede ser igual o muy parecida)",
          ),
        options: z
          .array(z.string())
          .length(4)
          .describe(
            "Exactamente 4 opciones de respuesta, en orden aleatorio, incluyendo la correcta",
          ),
        correct_option: z
          .number()
          .int()
          .min(0)
          .max(3)
          .describe("Índice (0 a 3) de la opción correcta dentro de 'options'"),
      }),
    )
    .describe(
      "Una pregunta de tipo test por cada tarjeta proporcionada, usando el mismo card_id que la tarjeta original",
    ),
});
