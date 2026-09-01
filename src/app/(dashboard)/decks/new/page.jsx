import { redirect } from "next/navigation";
import { Alert, FileUploadField, CreateDeckButton } from "@/components";
import { createClient } from "@/lib/supabase/server";
import { createDeck } from "@/app/actions";

/*
 Server Action, sin JavaScript de cliente. El navegador se encarga
 de mostrar el archivo seleccionado y de bloquear el envio si el
 campo "required" está vacio.
 */
export default async function NewDeckPage({ searchParams }) {
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

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Crear mazo desde archivos de apuntes
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Sube uno o varios archivos y la IA generará las tarjetas de estudio
        automáticamente. Puede tardar unos segundos.
      </p>

      <Alert type={type} message={message} className="mt-4" />

      <form action={createDeck} className="mt-6 flex flex-col gap-5">
        <FileUploadField />
        <CreateDeckButton />
      </form>
    </div>
  );
}
