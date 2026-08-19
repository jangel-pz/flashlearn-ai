import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Alert } from "@/components/Alert";
import { Flashcard } from "@/components/Flashcard";
import { DeleteDeckButton } from "@/components/DeleteDeckButton";
import { GenerateQuizButton } from "@/components/CreateQuizButton";

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

  return (
    <div className="max-w-2xl my-12 mx-auto p-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="text-sm text-gray-500">
          ← Volver
        </Link>
        <div className="flex items-center gap-3">
          <GenerateQuizButton deckId={deck.id} />
          <DeleteDeckButton deckId={deck.id} />
        </div>
      </div>

      <h1 className="mt-2">{deck.title}</h1>

      <Alert type={type} mesage={message} />

      <p className="text-sm text-gray-500">
        {cards?.length ?? 0} tarjeta{cards?.length === 1 ? "" : "s"}
      </p>

      {!cards || cards.length === 0 ? (
        <p className="mt-8 text-gray-500">
          Este mazo todavía no tiene tarjetas.
        </p>
      ) : (
        <div className="flex flex-col gap-4 mt-8">
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
    </div>
  );
}
