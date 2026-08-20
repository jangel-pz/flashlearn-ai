"use client";

import { useState } from "react";
import { submitQuizAttempt } from "@/app/actions/submitQuizAttempt";

function ResultIcon({ correct }) {
  return (
    <span className={correct ? "text-green-600" : "text-red-600"}>
      {correct ? "✔" : "✘"}
    </span>
  );
}

export function QuizPlayer({ questions }) {
  // answers: { [cardId]: <indice de opcion elegida> }
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function selectOption(cardId, optionIndex) {
    if (submitted) return; // ya corregido: no se puede cambiar la respuesta
    setAnswers((prev) => ({ ...prev, [cardId]: optionIndex }));
  }

  // Marca el cuestionario como corregido y envía los resultados para actualizar las estadísticas de cada tarjeta. Si esa segunda parte tarda o falla, no afecta a lo que el usuario ve en pantalla.
  async function handleSubmit() {
    setSubmitted(true);

    const results = questions.map((q) => ({
      cardId: q.cardId,
      correct: answers[q.cardId] === q.correctOption,
    }));

    try {
      await submitQuizAttempt(results);
    } catch (error) {
      console.error("No se pudieron guardar las estadísticas:", error);
    }
  }

  const answeredCount = Object.keys(answers).length;
  const score = questions.reduce(
    (total, q) => (answers[q.cardId] === q.correctOption ? total + 1 : total),
    0,
  );

  return (
    <div className="mt-8 flex flex-col gap-6">
      {questions.map((q, qIndex) => {
        const selected = answers[q.cardId];

        return (
          <div key={q.cardId} className="border rounded-lg p-4">
            <p className="font-medium">
              {qIndex + 1}. {q.questionText}
            </p>

            <div className="flex flex-col gap-2 mt-3">
              {q.options.map((option, optionIndex) => {
                const isSelected = selected === optionIndex;
                const isCorrectOption = optionIndex === q.correctOption;

                let extraClasses = "border-gray-300";
                if (submitted && isCorrectOption) {
                  extraClasses = "border-green-600 bg-green-50";
                } else if (submitted && isSelected && !isCorrectOption) {
                  extraClasses = "border-red-600 bg-red-50";
                } else if (!submitted && isSelected) {
                  extraClasses = "border-blue-600 bg-blue-50";
                }

                return (
                  <button
                    key={optionIndex}
                    type="button"
                    onClick={() => selectOption(q.cardId, optionIndex)}
                    disabled={submitted}
                    className={`flex items-center justify-between text-left border rounded px-3 py-2 disabled:cursor-default ${extraClasses}`}
                  >
                    <span>{option}</span>
                    {submitted && (isCorrectOption || isSelected) && (
                      <ResultIcon correct={isCorrectOption} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!submitted ? (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={answeredCount < questions.length}
          className="self-start bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          Corregir cuestionario
        </button>
      ) : (
        <p className="text-lg font-medium">
          Resultado: {score} de {questions.length} correctas
        </p>
      )}
    </div>
  );
}
