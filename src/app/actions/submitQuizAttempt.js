"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// results: array de { cardId, correct } — uno por cada pregunta respondida en este intento de cuestionario.
export async function submitQuizAttempt(results) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!results || results.length === 0) {
    return;
  }

  // La función RPC de Supabase espera un array de objetos con las claves exactas "card_id" y "correct"
  const payload = results.map((r) => ({
    card_id: r.cardId,
    correct: r.correct,
  }));

  const { error } = await supabase.rpc("register_quiz_results", {
    p_results: payload,
  });

  if (error) {
    // No es un error crítico para el usuario (ya ha visto su resultado en pantalla), solo se registra para depurar.
    console.error("Error guardando estadísticas del cuestionario:", error);
  }
}
