import Link from "next/link";
import { UserForm } from "@/components/UserForm";
import { login } from "@/app/actions/login";

/* Se usa un <form> con Server Action en vez de manejar el estado del formulario con JavaScript en el cliente
 */
export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const type = params?.type;
  const message = params?.message;

  return (
    <div className="max-w-90 my-20 mx-auto p-6">
      <h1>Iniciar sesión</h1>

      <UserForm submitAction={login} isLogin type={type} message={message} />

      <p className="mt-4">
        ¿No tienes una cuenta? <Link href="/signup">Regístrate</Link>
      </p>
    </div>
  );
}
