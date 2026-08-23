"use client";

import { useFormStatus } from "react-dom";

export function GenerateDeckButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {pending
        ? "Generando tarjetas de estudio…"
        : "Generar tarjetas de estudio"}
    </button>
  );
}
