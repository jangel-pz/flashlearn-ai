"use client";

import { LoginButton } from "@/components";

/**
 * Componente reutilizable que actua como formulario de registro
 * de usuarios. Permite registrar nuevos usuarios e iniciar
 * sesion con cuentas ya existentes
 * @param {Object} props - Propiedades del componente
 * @param {() => void} props.submitAction - Funcion a ejecutar cuando se envia el formulario
 * @param {boolean} props.isLogin - true si el usuario se esta registrando con una cuenta ya existente, false si se esta registrando con una nueva
 */
export function UserForm({ submitAction, isLogin }) {
  return (
    <form action={submitAction} className="flex flex-col gap-4">
      <label
        htmlFor="email"
        className="flex flex-col gap-1.5 text-sm font-medium text-slate-700"
      >
        Email
        <input
          id="email"
          name="email"
          type="email"
          required
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </label>

      <label
        htmlFor="password"
        className="flex flex-col gap-1.5 text-sm font-medium text-slate-700"
      >
        Contraseña
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />
      </label>

      <LoginButton isLogin={isLogin} />
    </form>
  );
}
