"use client";

import { useTransition } from "react";
import { generateQuiz } from "@/app/actions/createQuiz";

export function CreateQuizButton({ deckId }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(() => {
      generateQuiz(deckId);
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
