"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createQuiz, deleteDeck } from "@/app/actions";

export function DeckMenu({ deckId }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef(null);

  // Cierra el menu si el usuario hace clic fuera de el
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleQuiz() {
    setOpen(false);
    startTransition(() => {
      createQuiz(deckId);
    });
  }

  function handleDelete() {
    setOpen(false);
    const confirmed = window.confirm(
      "¿Seguro que quieres borrar este mazo? Se borrarán también todas sus tarjetas y explicaciones. Esta acción no se puede deshacer.",
    );
    if (!confirmed) return;
    startTransition(() => {
      deleteDeck(deckId);
    });
  }

  return (
    <div ref={menuRef} className="relative mr-1 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        aria-label="Opciones del mazo"
        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={handleQuiz}
            className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            Hacer cuestionario
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="block w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
          >
            Borrar mazo
          </button>
        </div>
      )}
    </div>
  );
}
