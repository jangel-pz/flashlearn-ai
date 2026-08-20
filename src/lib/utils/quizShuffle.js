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
export function shuffleQuiz(questions) {
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
