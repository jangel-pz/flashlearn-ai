/**
 * Componente reutilizable para representar el resultado
 * (correcto/incorrecto) de una pregunta de cuestionario
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.correct - true si la respuesta es correcto, false en caso contrario
 */
export function ResultIcon({ correct }) {
  return (
    <span className={correct ? "text-emerald-600" : "text-rose-600"}>
      {correct ? "✔" : "✘"}
    </span>
  );
}
