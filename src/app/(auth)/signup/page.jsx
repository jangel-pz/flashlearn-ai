import Link from "next/link";
import { UserForm } from "@/components/UserForm";
import { signup } from "@/app/actions/signup";

/* Se usa un <form> con Server Action en vez de manejar el estado del formulario con JavaScript en el cliente
 */
export default async function SignupPage({ searchParams }) {
  const params = await searchParams;
  const type = params?.type;
  const message = params?.message;

  return (
    <div className="max-w-90 my-20 mx-auto p-6">
      <h1>Crear cuenta</h1>

      <UserForm submitAction={signup} type={type} message={message} />

      <p className="mt-4">
        ¿Ya tienes una cuenta? <Link href="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
