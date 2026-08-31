"use client";

import { useState, useTransition } from "react";
import { createQuiz } from "@/app/actions";

/**
 * Componente que actua como ventana modal para la seleccion
 * de mazos. Permite empezar un cuestionario sobre el mazo
 * elegido.
 * @param {Object} props - Propiedades del componente
 * @param {Array<Deck>} props.decks - Listado de mazos disponibles
 */
export function QuizPickerButton({ decks }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handlePick(deckId) {
    startTransition(() => {
      createQuiz(deckId);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!decks || decks.length === 0}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Hacer cuestionario
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-slate-900">
              Tema del cuestionario
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Elige un mazo para empezar un cuestionario.
            </p>

            <ul className="mt-4 flex max-h-64 flex-col gap-1 overflow-y-auto">
              {decks.map((deck) => (
                <li key={deck.id}>
                  <button
                    type="button"
                    onClick={() => handlePick(deck.id)}
                    disabled={isPending}
                    className="w-full truncate rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 disabled:opacity-50"
                  >
                    {deck.title}
                  </button>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 text-sm text-slate-500 hover:text-slate-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
