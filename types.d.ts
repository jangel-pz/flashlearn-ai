interface Deck {
  id: string; // UUID generado al azar en base de datos
  user_id: string; // UUID del usuario al que pertenece el mazo
  title: string; // Titulo del mazo
  source_text: string; // Nombres de los archivos origen del contenido del mazo
  created_at: string; // Timestamp de creacion con zona horaria en formato ISO.
  updated_at: string; // Timestamp de actualizacion con zona horaria en formato ISO.
}

interface QuizQuestion {
  id: string; // UUID generado al azar en base de datos
  card_id: string; // UUID de la tarjeta a la que pertenece la pregunta de cuestionario
  question_text: string; // Contenido textual de la pregunta de cuestionario
  options: Array<string>; // Lista de opciones de respuesta
  correct_option: number; // Indice de la respuesta correcta en {@link options}
  created_at: string; // Timestamp de creacion con zona horaria en formato ISO
}

interface QuizResult {
  card_id: string; // UUID de la tarjeta a la que pertenece la pregunta de cuestionario
  correct: boolean; // true si se eligio la respuesta correcta, false en caso contrario
}
