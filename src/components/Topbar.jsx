import { AppIcon } from "@/components/AppIcon";
import { LogoutButton } from "@/components/LogoutButton";

export function Topbar({ sidebarOpen, onToggleSidebar }) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Ocultar menú" : "Mostrar menú"}
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <AppIcon />
          <span className="text-base font-bold tracking-tight text-slate-900">
            FlashLearn AI
          </span>
        </div>
      </div>

      <LogoutButton />
    </header>
  );
}
