"use client";

import { useTransition } from "react";
import { deleteDeck } from "@/app/actions";

// Client Component para usar window.confirm() antes de ejecutar una acción destructiva e irreversible.
export function DeleteDeckButton({ deckId }) {
  const [isPending, startTransition] = useTransition();

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
