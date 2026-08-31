"use client";

import { useState } from "react";
import { Topbar, Sidebar } from "@/components";

/**
 * Componente que actua como marco de la aplicacion. Permite
 * insertar un Topbar y un Sidebar sobre el contenido principal
 * @param {Object} props - Propiedades del componente
 * @param {Array<Deck>} props.decks - Listado de mazos disponibles
 * @param {import('react').ReactNode} props.children - Contenido principal
 */
export function AppShell({ decks, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Topbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />

      <div className="relative flex flex-1 min-h-0">
        {/* Fondo oscurecido solo en movil, para cerrar la sidebar tocando fuera */}
        {sidebarOpen && (
          <div
            className="fixed inset-x-0 top-14 bottom-0 z-20 bg-slate-900/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          open={sidebarOpen}
          decks={decks}
          onNavigate={() => setSidebarOpen(false)}
        />

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-6 sm:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
