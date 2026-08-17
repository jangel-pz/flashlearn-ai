"use client";

import { useState } from "react";
import { explainCard } from "@/app/actions/explainCard";

// Componente de cliente para mostrar/ocultar respuestas
export function Flashcard({ id, question, answer }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explainError, setExplainError] = useState(null);

  async function handleExplain() {
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
    <div className="border rounded-lg p-4">
      <p className="font-medium">{question}</p>

      {!showAnswer ? (
        <button
          type="button"
          onClick={() => setShowAnswer(true)}
          className="mt-3 text-sm text-blue-600 underline"
        >
          Ver respuesta
        </button>
      ) : (
        <div>
          <p className="mt-3 text-gray-700">{answer}</p>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowAnswer(false)}
              className="text-sm text-red-600 underline"
            >
              Ocultar respuesta
            </button>

            {!explanation && (
              <button
                type="button"
                onClick={handleExplain}
                disabled={isExplaining}
                className="text-sm text-blue-600 underline disabled:text-gray-400 disabled:no-underline"
              >
                {isExplaining
                  ? "Generando explicación…"
                  : "Explicar más a fondo"}
              </button>
            )}
          </div>

          {explanation && (
            <div>
              <p className="mt-3 text-sm text-gray-600 border-t pt-3">
                {explanation}
              </p>
              <button
                type="button"
                onClick={() => setExplanation(false)}
                className="mt-3 text-sm text-red-600 underline"
              >
                Ocultar explicación
              </button>
            </div>
          )}

          {explainError && (
            <p className="mt-2 text-sm text-red-600">{explainError}</p>
          )}
        </div>
      )}
    </div>
  );
}
