import Link from "next/link";

export function DeckCard({ id, title }) {
  return (
    <li>
      <Link
        href={`/decks/${id}`}
        className="block border rounded-lg p-3 hover:bg-gray-50"
      >
        {title}
      </Link>
    </li>
  );
}
