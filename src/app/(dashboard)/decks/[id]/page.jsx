import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Alert,
  BackLink,
  Flashcard,
  DeleteDeckButton,
  CreateQuizButton,
} from "@/components";

export default async function DeckPage({ params, searchParams }) {
  const { id } = await params;
  const sParams = await searchParams;
  const type = sParams?.type;
  const message = sParams?.message;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: deck, error: deckError } = await supabase
    .from("decks")
    .select("*")
    .eq("id", id)
    .single();

  // RLS impide leer mazos ajenos. Se trata error generico
  if (deckError || !deck) {
    notFound();
  }

  const { data: cards, error: cardsError } = await supabase
    .from("cards")
    .select("*")
    .eq("deck_id", id)
    .order("position");

  if (cardsError) {
    console.error(cardsError);
  }

  const sourceFiles = (deck.source_text ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  const createdAt = new Date(deck.created_at).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-5xl">
      <BackLink href="/dashboard">← Volver al menú</BackLink>

      <Alert type={type} message={message} className="mt-4" />

      <header className="mt-4 rounded-xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {deck.title}
        </h1>

        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
          <span>
            {cards?.length ?? 0} tarjeta{cards?.length === 1 ? "" : "s"}
          </span>
          <span>Creado el {createdAt}</span>
          {sourceFiles.length > 0 && (
            <span className="truncate">
              Creado desde: {sourceFiles.join(", ")}
            </span>
          )}
        </div>
      </header>

      {!cards || cards.length === 0 ? (
        <p className="mt-10 text-sm text-slate-400">
          Este mazo todavía no tiene tarjetas.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <Flashcard
              key={card.id}
              id={card.id}
              question={card.question}
              answer={card.answer}
            />
          ))}
        </div>
      )}

      <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6">
        <CreateQuizButton deckId={deck.id} />
        <DeleteDeckButton deckId={deck.id} />
      </div>
    </div>
  );
}
