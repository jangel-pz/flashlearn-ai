"use client";

import { useState } from "react";

// Componente de cliente para mostrar/ocultar respuestas
export function Flashcard({ question, answer }) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="border rounded-lg p-4">
      <p className="font-medium">{question}</p>

      {showAnswer ? (
        <div>
          <p className="mt-3 text-gray-700">{answer}</p>
          <button
            type="button"
            onClick={() => setShowAnswer(false)}
            className="mt-3 text-sm text-red-600 underline"
          >
            Ocultar respuesta
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAnswer(true)}
          className="mt-3 text-sm text-blue-600 underline"
        >
          Ver respuesta
        </button>
      )}
    </div>
  );
}
