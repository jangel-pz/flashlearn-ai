import { generateDeckFromFiles } from "@/app/actions/createDeck";

/* Server Action, sin JavaScript de cliente. El navegador se encarga de mostrar el archivo seleccionado y de bloquear el envío si el campo "required" está vacío.
 */
export default async function NewDeckPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <div className="max-w-xl my-20 mx-auto p-6">
      <h1>Crear mazo desde archivo</h1>
      <p className="text-sm text-gray-500 mt-1">
        Sube uno o varios archivos y la IA generará las tarjetas de estudio
        automáticamente. Puede tardar unos segundos.
      </p>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      <form action={generateDeckFromFiles} className="flex flex-col gap-4 mt-6">
        <label htmlFor="files">
          Archivo(s)
          <input
            id="files"
            name="files"
            type="file"
            accept=".pdf,.txt,.md"
            multiple
            required
            className="block w-full mt-1"
          />
        </label>

        <button type="submit">Generar mazo</button>
      </form>
    </div>
  );
}
