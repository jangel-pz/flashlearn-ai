"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Elimina de la base de datos un mazo determinado, asi como todas
 * sus tarjetas y preguntas de cuestionario asociadas
 * @param {string} deckId - UUID del mazo a eliminar
 */
export async function deleteDeck(deckId) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("decks").delete().eq("id", deckId);

  if (error) {
    console.error("Error borrando el mazo:", error);
    redirect(
      `/decks/${deckId}?error=` +
        encodeURIComponent("No se pudo borrar el mazo"),
    );
  }

  redirect(
    "/dashboard?type=success&message=" + encodeURIComponent("Mazo borrado"),
  );
}
