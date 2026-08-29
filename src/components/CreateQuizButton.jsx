"use client";

import { useTransition } from "react";
import { createQuiz } from "@/app/actions";

/**
 * Boton reutilizable para la creacion de cuestionarios
 * con bloqueo durante la ejecucion del evento
 * @param {Object} props - Propiedades del componente
 * @param {string} props.deckId - UUID del mazo sobre el que se quiere generar el cuestionario
 */
export function CreateQuizButton({ deckId }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      createQuiz(deckId);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {isPending ? "Generando cuestionario…" : "Hacer cuestionario"}
    </button>
  );
}
