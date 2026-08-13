"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/* Esta función se ejecuta en el SERVIDOR (nunca en el navegador del usuario), por eso es segura para hablar con Supabase directamente. Next.js la conecta con el <form> de la página gracias a `action={signup}`.
 */
export async function signup(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    redirect(
      "/signup?error=" + encodeURIComponent("Rellene email y contraseña"),
    );
  }

  const supabase = await createClient();

  /* 'origin' es la URL desde la que se hizo la petición (localhost en desarrollo, el dominio real en producción). Le indica a Supabase dónde debe mandar al usuario cuando confirme su email.
   */
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/api/auth`,
    },
  });

  if (error) {
    redirect("/signup?error=" + encodeURIComponent(error.message));
  }

  /* Por defecto Supabase exige confirmar el email antes de poder entrar, así que se avisa al usuario de que revise su bandeja de entrada.
   */
  redirect(
    "/signup?message=" +
      encodeURIComponent("Le hemos enviado un email para confirmar su cuenta."),
  );
}
