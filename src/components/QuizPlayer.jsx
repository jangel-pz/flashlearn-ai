"use client";

import { useState } from "react";

function ResultIcon({ correct }) {
  return (
    <span className={correct ? "text-green-600" : "text-red-600"}>
      {correct ? "✔" : "✘"}
    </span>
  );
}

// Devuelve una copia de un array en orden aleatorio (algoritmo de Fisher-Yates).
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Baraja el orden de las preguntas y, dentro de cada una, el orden de sus opciones, recalculando el índice de la opción correcta para que siga apuntando a la correcta tras el barajado.
function shuffleQuiz(questions) {
  const shuffledQuestions = shuffleArray(questions);

  return shuffledQuestions.map((q) => {
    const optionsWithOriginalIndex = q.options.map((option, index) => ({
      option,
      isCorrect: index === q.correctOption,
    }));

    const shuffledOptions = shuffleArray(optionsWithOriginalIndex);

    return {
      ...q,
      options: shuffledOptions.map((o) => o.option),
      correctOption: shuffledOptions.findIndex((o) => o.isCorrect),
    };
  });
}

export function QuizPlayer({ questions }) {
  // El barajado se calcula una sola vez al montar el componente, no en cada renderizado. Así el orden se mantiene estable mientras el usuario responde el cuestionario.
  const [shuffledQuestions] = useState(() => shuffleQuiz(questions));

  // answers: { [cardId]: <indice de opcion elegida> }
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function selectOption(cardId, optionIndex) {
    if (submitted) return; // ya corregido: no se puede cambiar la respuesta
    setAnswers((prev) => ({ ...prev, [cardId]: optionIndex }));
  }

  const answeredCount = Object.keys(answers).length;
  const score = shuffledQuestions.reduce(
    (total, q) => (answers[q.cardId] === q.correctOption ? total + 1 : total),
    0,
  );

  return (
    <div className="mt-8 flex flex-col gap-6">
      {shuffledQuestions.map((q, qIndex) => {
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
          onClick={() => setSubmitted(true)}
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
