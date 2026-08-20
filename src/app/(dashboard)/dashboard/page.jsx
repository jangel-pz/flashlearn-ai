import Link from "next/link";
import { redirect } from "next/navigation";
import { Alert } from "@/components/Alert";
import { DeckCard } from "@/components/DeckCard";
import { LogoutButton } from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";

/* Esta página comprueba POR SU CUENTA si hay un usuario logueado. Usa getUser() (no getSession()) porque getUser() verifica el token contra los servidores de Supabase mientras que getSession() solo lee la cookie (que en teoría se podría falsificar).
 */
export default async function DashboardPage({ searchParams }) {
  const params = await searchParams;
  const type = params?.type;
  const message = params?.message;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: decks, error: decksError } = await supabase
    .from("decks")
    .select("id, title, created_at")
    .order("created_at", { ascending: false });

  if (decksError) {
    console.error(decksError);
  }

  return (
    <div className="max-w-2xl my-20 mx-auto p-6">
      <h1>Bienvenido</h1>
      <p>Sesión iniciada como: {user.email}</p>

      <Alert type={type} mesage={message} className="mt-4" />

      <div className="flex items-center justify-between mt-8">
        <h2 className="text-lg font-medium">Tus mazos</h2>
        <Link
          href="/decks/new"
          className="text-sm bg-blue-600 text-white px-3 py-2 rounded"
        >
          + Crear mazo
        </Link>
      </div>

      {!decks || decks.length === 0 ? (
        <p className="mt-4 text-gray-500">
          Todavía no has creado ningún mazo. Empieza subiendo un archivo.
        </p>
      ) : (
        <ul className="flex flex-col gap-2 mt-4">
          {decks.map((deck) => (
            <DeckCard key={deck.id} id={deck.id} title={deck.title} />
          ))}
        </ul>
      )}

      <div className="mt-10">
        <LogoutButton />
      </div>
    </div>
  );
}
