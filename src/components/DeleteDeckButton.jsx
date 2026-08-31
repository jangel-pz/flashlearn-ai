"use client";

import { useTransition } from "react";
import { deleteDeck } from "@/app/actions";

/**
 * Boton reutilizable para la eliminacion de mazos con bloqueo
 * durante la ejecucion del evento y dialogo de confirmacion
 * @param {Object} props - Propiedades del componente
 * @param {string} props.deckId - UUID del mazo sobre el que se quiere generar el cuestionario
 */
export function DeleteDeckButton({ deckId }) {
  const [isPending, startTransition] = useTransition();

  // Usar window.confirm() antes de ejecutar una accion destructiva e irreversible.
  function handleDelete() {
    const confirmed = window.confirm(
      "¿Seguro que quieres borrar este mazo? Se borrarán también todas sus tarjetas y explicaciones. Esta acción no se puede deshacer.",
    );

    if (!confirmed) return;

    startTransition(() => {
      deleteDeck(deckId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm font-medium text-rose-600 hover:text-rose-700 disabled:text-slate-400"
    >
      {isPending ? "Borrando…" : "Borrar mazo"}
    </button>
  );
}
