import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/login";

/* Esta página comprueba POR SU CUENTA si hay un usuario logueado. Usa getUser() (no getSession()) porque getUser() verifica el token contra los servidores de Supabase mientras que getSession() solo lee la cookie (que en teoría se podría falsificar).
 */
export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-90 my-20 mx-auto p-6">
      <h1>Bienvenido</h1>
      <p>Sesión iniciada como: {user.email}</p>

      <form action={logout}>
        <button type="submit">Cerrar sesión</button>
      </form>
    </div>
  );
}
