export function Alert({ type = "error", message, className = "" }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`rounded-lg border px-4 py-2.5 text-sm ${
        isSuccess
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-rose-200 bg-rose-50 text-rose-700"
      } ${className}`}
    >
      {message}
    </div>
  );
}
