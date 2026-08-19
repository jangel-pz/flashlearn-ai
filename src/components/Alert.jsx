export function Alert({ type = "error", message, className = "mt-2" }) {
  if (!message) return null;

  const colorClass = type === "success" ? "text-green-600" : "text-red-600";

  return <p className={`${colorClass} ${className}`}>{message}</p>;
}
