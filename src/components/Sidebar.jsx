"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DeckMenu } from "@/components/DeckMenu";

export function Sidebar({ open, decks, onNavigate }) {
  const pathname = usePathname();

  // En movil, al navegar a un mazo se cierra la sidebar para dejar ver el contenido. En escritorio solo actua por debajo de 768px.
  function handleNavigate() {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onNavigate?.();
    }
  }

  return (
    <aside
      className={`
        fixed left-0 top-14 bottom-0 z-30 w-72 border-r border-slate-200 bg-white
        transition-transform duration-200 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:static md:transition-[width] md:duration-200
        ${open ? "md:w-72" : "md:w-0 md:overflow-hidden md:border-none"}
      `}
    >
      <div className="flex h-full w-72 flex-col p-4">
        <Link
          href="/decks/new"
          onClick={handleNavigate}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <span className="text-base leading-none">+</span>
          Nuevo mazo
        </Link>

        <p className="mt-6 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Tus mazos
        </p>

        {!decks || decks.length === 0 ? (
          <p className="mt-3 px-2 text-sm text-slate-400">
            Todavía no tienes ningún mazo.
          </p>
        ) : (
          <ul className="mt-2 flex flex-1 flex-col gap-0.5 overflow-y-auto">
            {decks.map((deck) => {
              const href = `/decks/${deck.id}`;
              const isActive = pathname === href;

              return (
                <li
                  key={deck.id}
                  className={`flex items-center rounded-md ${
                    isActive ? "bg-indigo-50" : "hover:bg-slate-50"
                  }`}
                >
                  <Link
                    href={href}
                    onClick={handleNavigate}
                    title={deck.title}
                    className={`flex-1 truncate px-2 py-2 text-sm ${
                      isActive
                        ? "font-medium text-indigo-700"
                        : "text-slate-700"
                    }`}
                  >
                    {deck.title}
                  </Link>
                  <DeckMenu deckId={deck.id} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
