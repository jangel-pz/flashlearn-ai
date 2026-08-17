"use client";

import { useTransition } from "react";
import { deleteDeck } from "@/app/actions/deleteDeck";

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
      className="text-sm text-red-600 underline disabled:text-gray-400 disabled:no-underline"
    >
      {isPending ? "Borrando…" : "Borrar mazo"}
    </button>
  );
}
