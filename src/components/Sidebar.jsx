"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DeckMenu } from "@/components";

/**
 * Componente que actua como barra laterla de navegacion
 * reutilizable. Incluye un enlace a la creacion de mazos nuevos
 * y un listado de los mazos ya creados
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.open - true si la barra lateral esta desplegada, false en caso contrario
 * @param {Array<Deck>} props.decks - Listado de mazos disponibles
 * @param {() => void} props.onNavigate - Funcion a ejecutar cuando se selecciona una opcion de navegacion
 */
export function Sidebar({ override, decks, onNavigate }) {
  const pathname = usePathname();

  /**
   * Cierra automaticamente la barra lateral cuando se selecciona
   * una opcion de navegacion en dispositivos moviles o en
   * escritorio por debajo de los 768px
   */
  function handleNavigate() {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onNavigate?.();
    }
  }

  /*
   Por defecto (override === null) el estado se resuelve solo con
   CSS: abierta en escritorio (md:translate-x-0), fuera de pantalla
   en movil (-translate-x-full). Si el usuario ha tocado el botón,
   "override" manda en cualquier tamaño de pantalla.
   */
  let stateClasses;
  if (override === null) {
    stateClasses = "-translate-x-full md:translate-x-0";
  } else if (override) {
    stateClasses = "translate-x-0";
  } else {
    stateClasses = "-translate-x-full md:w-0 md:overflow-hidden md:border-none";
  }

  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 z-30 w-72 border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out md:static md:transition-[width] md:duration-200 ${stateClasses}`}
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
