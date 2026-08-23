import { Alert } from "@/components/Alert";
import { FileUploadField } from "@/components/FileUploadField";
import { GenerateDeckButton } from "@/components/CreateDeckButton";
import { generateDeckFromFiles } from "@/app/actions/createDeck";

/* Server Action, sin JavaScript de cliente. El navegador se encarga de mostrar el archivo seleccionado y de bloquear el envío si el campo "required" está vacío.
 */
export default async function NewDeckPage({ searchParams }) {
  const params = await searchParams;
  const type = params?.type;
  const message = params?.message;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        Crear mazo desde archivo
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Sube uno o varios archivos y la IA generará las tarjetas de estudio
        automáticamente. Puede tardar unos segundos.
      </p>

      <Alert type={type} message={message} className="mt-4" />

      <form action={generateDeckFromFiles} className="mt-6 flex flex-col gap-5">
        <FileUploadField />
        <GenerateDeckButton />
      </form>
    </div>
  );
}
