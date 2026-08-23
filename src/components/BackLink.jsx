import Link from "next/link";

export function BackLink({ href, children = "← Volver" }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700"
    >
      {children}
    </Link>
  );
}
