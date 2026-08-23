"use client";

import { useTransition } from "react";
import { logout } from "@/app/actions/login";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(() => {
      logout();
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:text-slate-300"
    >
      {isPending ? "Cerrando sesión…" : "Cerrar sesión"}
    </button>
  );
}
