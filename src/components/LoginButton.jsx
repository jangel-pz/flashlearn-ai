"use client";

import { useFormStatus } from "react-dom";

/**
 * Boton reutilizable para el inicio de sesion con bloqueo
 * durante la ejecucion del evento. Debe integrarse en un
 * formulario
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isLogin - true si el usuario se esta registrando con una cuenta ya existente, false si se esta registrando con una nueva
 */
export function LoginButton({ isLogin }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {pending ? "Un momento…" : isLogin ? "Iniciar sesión" : "Crear cuenta"}
    </button>
  );
}
