import Link from "next/link";

/**
 * Componente link reutilizable
 * @param {Object} props - Propiedades del componente
 * @param {string} props.href - URL de la pagina a la que redirige el link
 * @param {string} props.children - Texto indicativo para mostrar el destino de la redireccion
 */
export function BackLink({ href, children = "← Volver" }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
    >
      {children}
    </Link>
  );
}
