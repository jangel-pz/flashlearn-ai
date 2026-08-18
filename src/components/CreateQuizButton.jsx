"use client";

import { useTransition } from "react";
import { generateQuiz } from "@/app/actions/createQuiz";

export function GenerateQuizButton({ deckId }) {
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
      className="text-sm bg-blue-600 text-white px-3 py-2 rounded disabled:bg-gray-400"
    >
      {isPending ? "Generando cuestionario…" : "Hacer cuestionario"}
    </button>
  );
}
