"use client";

import { useState } from "react";
import { explainCard } from "@/app/actions/explainCard";

// Componente de cliente para mostrar/ocultar respuestas
export function Flashcard({ id, question, answer }) {
  const [flipped, setFlipped] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainError, setExplainError] = useState(null);

  function toggleFlip() {
    setFlipped((v) => !v);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFlip();
    }
  }

  // stopPropagation hace que el clic en el boton no haga clic en la tarjeta entera y no vuelva a girar.
  async function handleExplain(event) {
    event.stopPropagation();
    setIsExplaining(true);
    setExplainError(null);

    const result = await explainCard(id);

    if (result.error) {
      setExplainError(result.error);
    } else {
      setExplanation(result.explanation);
    }

    setIsExplaining(false);
  }

  return (
    <div className="perspective-distant">
      <div
        role="button"
        tabIndex={0}
        onClick={toggleFlip}
        onKeyDown={handleKeyDown}
        className={`relative h-64 w-full cursor-pointer rounded-xl transition-transform duration-500 transform-3d focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
          flipped ? "transform-[rotateY(180deg)]" : ""
        }`}
      >
        {/* Cara frontal: pregunta */}
        <div className="absolute inset-0 flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm backface-hidden">
          <span className="h-1.5 w-10 rounded-full bg-indigo-500" />
          <div className="mt-4 flex flex-1 items-center overflow-y-auto">
            <p className="font-medium text-slate-800">{question}</p>
          </div>
          <span className="text-xs text-slate-400">Ver respuesta</span>
        </div>

        {/* Cara trasera: respuesta y explicacion */}
        <div className="absolute inset-0 flex flex-col overflow-y-auto rounded-xl border border-indigo-200 bg-indigo-50/60 p-5 shadow-sm backface-hidden transform-[rotateY(180deg)]">
          <span className="h-1.5 w-10 rounded-full bg-indigo-500" />
          <p className="mt-4 text-slate-700">{answer}</p>

          {!explanation && (
            <button
              type="button"
              onClick={handleExplain}
              disabled={isExplaining}
              className="mt-3 self-start text-xs font-semibold text-indigo-600 hover:underline disabled:text-slate-400"
            >
              {isExplaining ? "Generando explicación…" : "Explicar más a fondo"}
            </button>
          )}

          {explanation && (
            <p className="mt-3 border-t border-indigo-200 pt-3 text-sm text-slate-600">
              {explanation}
            </p>
          )}

          {explainError && (
            <p className="mt-2 text-xs text-rose-600">{explainError}</p>
          )}

          <span className="mt-auto pt-3 text-xs text-slate-400">
            Volver a la pregunta
          </span>
        </div>
      </div>
    </div>
  );
}
