"use client";

import ReactMarkdown from "react-markdown";
import { RemoveIcon } from "@/components/icons";

/**
 * Ventana modal para mostrar explicaciones detalladas de
 * tarjetas de estudio
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.open - Indica si la ventana esta abierta o cerrada en un momento determinado
 * @param {() => void} props.onClose - Accion a realizar cuando se cierra la ventana
 * @param {string} props.explanation - Contenido textual de la explacacion de la tarjeta de estudio
 */
export function ExplanationModal({ open, onClose, explanation }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-slate-900">
            Explicación detallada
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <RemoveIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 text-sm leading-relaxed text-slate-700 [&>p]:mt-3 [&>p:first-child]:mt-0 [&_strong]:font-semibold [&_em]:italic">
          <ReactMarkdown>{explanation}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
