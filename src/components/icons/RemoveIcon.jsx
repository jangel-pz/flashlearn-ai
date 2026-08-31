/**
 * Icono de cruz para representar cierre o borrado de elementos
 * @param {Object} props - Propiedades del componente
 * @param {string} props.className - Clases opcionales de TailwindCSS
 */
export function RemoveIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
