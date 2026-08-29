/**
 * Logotipo de la aplicacion
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.className="h-5 w-5"] - Clases opcionales de TailwindCSS
 */
export function AppIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <rect
        x="6"
        y="8"
        width="14"
        height="10"
        rx="2"
        className="fill-indigo-100 stroke-indigo-400"
        strokeWidth="1.2"
      />
      <rect
        x="4"
        y="5"
        width="14"
        height="10"
        rx="2"
        className="fill-indigo-600"
      />
    </svg>
  );
}
