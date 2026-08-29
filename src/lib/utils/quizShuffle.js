/**
 * Ordena aleatoriamente los elementos de un array mediante el
 * algoritmo de Fisher-Yates
 * @param {Array<any>} array - Array de elementos original
 * @returns {Array<any>} Una copia del array original con los elementos reordenados
 */
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Baraja el orden de las preguntas y, dentro de cada una, el orden de sus opciones, recalculando el índice de la opción correcta para que siga apuntando a la correcta tras el barajado.
/**
 * Reordena aleatoriamente una lista de preguntas de cuestionario,
 * asi como las opciones de respuesta de cada una. Recalcula el
 * indice de la opcion correcta tras alterar el orden de las
 * mismas
 * @param {Array<QuizQuestion>} questions - Lista de preguntas de cuestionario original
 * @returns {Array<QuizQuestion>} Una nueva lista con las mismas preguntas reordenadas
 */
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
