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
  /*
   Null: sin preferencia explicita: se usa el comportamiento por
   defecto (resuelto por CSS).
   
   true/false: el usuario ha pulsado el boton y ha forzado ese
   estado.
  */
  const [override, setOverride] = useState(null);

  function toggleSidebar() {
    if (override === null) {
      setOverride(window.innerWidth < 768);
    } else {
      setOverride((v) => !v);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Topbar sidebarOpen={override ?? true} onToggleSidebar={toggleSidebar} />

      <div className="relative flex flex-1 min-h-0">
        {/* Fondo oscurecido solo en movil, para cerrar la sidebar tocando fuera */}
        {override === true && (
          <div
            className="fixed inset-x-0 top-14 bottom-0 z-20 bg-slate-900/30 md:hidden"
            onClick={() => setOverride(false)}
          />
        )}

        <Sidebar
          override={override}
          decks={decks}
          onNavigate={() => setOverride(false)}
        />

        <main className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-6 sm:p-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
