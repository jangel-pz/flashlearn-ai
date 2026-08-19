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
      className="text-sm text-gray-500 underline disabled:text-gray-400"
    >
      {isPending ? "Cerrando sesión…" : "Cerrar sesión"}
    </button>
  );
}
