import Link from "next/link";
import { Alert, UserForm } from "@/components";
import { signup } from "@/app/actions";

export default async function SignupPage({ searchParams }) {
  const params = await searchParams;
  const type = params?.type;
  const message = params?.message;

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight text-slate-900">
        Crear cuenta
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Regístrate para empezar a crear tus tarjetas de estudio.
      </p>

      <Alert type={type} message={message} className="mt-4" />

      <div className="mt-6">
        <UserForm submitAction={signup} />
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-700"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
