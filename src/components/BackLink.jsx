import Link from "next/link";

export function BackLink({ href, children = "← Volver" }) {
  return (
    <Link href={href} className="text-sm text-gray-500">
      {children}
    </Link>
  );
}
