import { AppIcon } from "@/components/icons";

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center justify-center gap-2">
          <AppIcon className="h-6 w-6" />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            FlashLearn AI
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
