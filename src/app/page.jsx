import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppIcon } from "@/components/AppIcon";

function UploadDeckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-12 w-12 text-indigo-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 17.5l1-2 1 2 2 1-2 1-1 2-1-2-2-1z" />
    </svg>
  );
}

function ExplainIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-12 w-12 text-indigo-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 00-3.6 10.8c.5.4.8 1 .8 1.7V16h5.6v-.5c0-.7.3-1.3.8-1.7A6 6 0 0012 3z" />
    </svg>
  );
}

function QuizIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-12 w-12 text-indigo-600"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 3.5h6a1 1 0 011 1V6H8V4.5a1 1 0 011-1z" />
      <path d="M8.5 12.5l1.5 1.5 3-3" />
      <path d="M9 17h6" />
    </svg>
  );
}

function FeatureSection({ index, title, description, icon, reverse = false }) {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div
        className={`mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 sm:py-20 md:flex-row ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-2xl bg-indigo-50">
          {icon}
        </div>

        <div className="max-w-xl text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
            {index}
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

export default async function LandingPage() {
  // Si ya hay sesión iniciada se manda al usuario directo al dashboard.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <AppIcon className="h-8 w-8" />

            <h1 className="mt-3 text-6xl font-bold tracking-tight text-slate-900 md:text-7xl">
              FlashLearn AI
            </h1>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
              >
                Crear cuenta
              </Link>
            </div>
          </div>

          <div>
            <p className="text-lg leading-relaxed text-slate-600">
              Sube tus apuntes y deja que la IA convierta el contenido en
              tarjetas de estudio, te explique con más detalle lo que no
              entiendas y te ponga a prueba con cuestionarios — todo en un mismo
              sitio.
            </p>
          </div>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <FeatureSection
        index="01"
        title="Crea mazos a partir de tus apuntes"
        description="Sube tus archivos en PDF, TXT o MD y la IA analiza el contenido para generar automáticamente un mazo de tarjetas de pregunta y respuesta, listo para repasar."
        icon={<UploadDeckIcon />}
      />
      <FeatureSection
        index="02"
        title="Explicaciones a fondo cuando las necesites"
        description="¿Una tarjeta no te queda clara? Pide una explicación más detallada y la IA la desarrolla con ejemplos y analogías, manteniendo el mismo nivel y enfoque de tu material original."
        icon={<ExplainIcon />}
        reverse
      />
      <FeatureSection
        index="03"
        title="Ponte a prueba con cuestionarios"
        description="Genera cuestionarios de tipo test a partir de las tarjetas de cualquier mazo y comprueba cuánto recuerdas, con estadísticas de aciertos guardadas por tarjeta."
        icon={<QuizIcon />}
      />
    </div>
  );
}
