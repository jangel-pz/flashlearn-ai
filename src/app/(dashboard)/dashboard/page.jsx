import Link from "next/link";
import { redirect } from "next/navigation";
import { Alert, QuizPickerButton } from "@/components";
import { createClient } from "@/lib/supabase/server";

/* Esta página comprueba por su cuenta si hay un usuario logueado. Usa getUser() (no getSession()) porque getUser() verifica el token contra los servidores de Supabase mientras que getSession() solo lee la cookie (que en teoría se podría falsificar).
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
    .select("id, title")
    .order("created_at", { ascending: false });

  if (decksError) {
    console.error(decksError);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Alert type={type} message={message} className="mb-6" />

      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Hola de nuevo
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Sesión iniciada como {user.email}
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/decks/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
        >
          + Crear mazo
        </Link>

        <QuizPickerButton decks={decks ?? []} />
      </div>

      {(!decks || decks.length === 0) && (
        <p className="mt-10 text-sm text-slate-400">
          Todavía no has creado ningún mazo. Empieza pulsando &quot;Crear
          mazo&quot;.
        </p>
      )}
    </div>
  );
}
