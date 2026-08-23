"use client";

import { useState } from "react";
import { Topbar } from "@/components/Topbar";
import { Sidebar } from "@/components/Sidebar";

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
