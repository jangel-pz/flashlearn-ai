"use client";

import { useFormStatus } from "react-dom";

function SubmitButton({ isLogin }) {
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

      <SubmitButton isLogin={isLogin} />
    </form>
  );
}
