import Link from "next/link";
import { Alert, UserForm } from "@/components";
import { login } from "@/app/actions/login";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const type = params?.type;
  const message = params?.message;

  return (
    <div>
      <h1 className="text-xl font-bold tracking-tight text-slate-900">
        Iniciar sesión
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Introduce tus datos para acceder a la aplicación.
      </p>

      <Alert type={type} message={message} className="mt-4" />

      <div className="mt-6">
        <UserForm submitAction={login} isLogin />
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/signup"
          className="font-medium text-indigo-600 hover:text-indigo-700"
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
}
