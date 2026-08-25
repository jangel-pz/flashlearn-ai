"use client";

import { useState } from "react";
import { submitQuizAttempt } from "@/app/actions";

function ResultIcon({ correct }) {
  return (
    <span className={correct ? "text-emerald-600" : "text-rose-600"}>
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
    <div className="mt-6 flex flex-col gap-4">
      {!submitted && (
        <p className="text-sm text-slate-500">
          {answeredCount} de {questions.length} respondidas
        </p>
      )}

      {questions.map((q, qIndex) => {
        const selected = answers[q.cardId];

        return (
          <div
            key={q.cardId}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="font-medium text-slate-800">
              {qIndex + 1}. {q.questionText}
            </p>

            <div className="mt-3 flex flex-col gap-2">
              {q.options.map((option, optionIndex) => {
                const isSelected = selected === optionIndex;
                const isCorrectOption = optionIndex === q.correctOption;

                let extraClasses = "border-slate-200 hover:bg-slate-50";
                if (submitted && isCorrectOption) {
                  extraClasses = "border-emerald-400 bg-emerald-50";
                } else if (submitted && isSelected && !isCorrectOption) {
                  extraClasses = "border-rose-400 bg-rose-50";
                } else if (!submitted && isSelected) {
                  extraClasses = "border-indigo-400 bg-indigo-50";
                }

                return (
                  <button
                    key={optionIndex}
                    type="button"
                    onClick={() => selectOption(q.cardId, optionIndex)}
                    disabled={submitted}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm text-slate-700 disabled:cursor-default ${extraClasses}`}
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
          className="self-start rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Corregir cuestionario
        </button>
      ) : (
        <p className="rounded-lg bg-slate-100 px-4 py-3 text-base font-semibold text-slate-800">
          Resultado: {score} de {questions.length} correctas
        </p>
      )}
    </div>
  );
}
