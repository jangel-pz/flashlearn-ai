"use client";

import { useFormStatus } from "react-dom";

export function GenerateDeckButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 text-white px-3 py-2 rounded disabled:bg-gray-400"
    >
      {pending ? "Generando tarjetas de estudio…" : "Generar mazo"}
    </button>
  );
}
