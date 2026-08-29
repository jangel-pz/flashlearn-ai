"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * Crea una nueva cuenta de usuario asociada al email y la
 * contraseña indicadas e inicia sesion con ella
 * @param {Array<string>} formData - Contenido de los campos 'Email' y 'Contraseña' del formulario de registro
 */
export async function signup(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    redirect(
      "/signup?type=error&message=" +
        encodeURIComponent("Rellene email y contraseña"),
    );
  }

  const supabase = await createClient();

  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/api/auth`,
    },
  });

  if (error) {
    redirect(
      "/signup?type=error&message=" +
        encodeURIComponent(
          "Ha ocurrido un error. Por favor, intente registrarse de nuevo",
        ),
    );
  }

  /*
   Por defecto Supabase exige confirmar el email antes de poder
   entrar, asi que se avisa al usuario de que revise su bandeja de
   entrada.
   */
  redirect(
    "/signup?type=success&message=" +
      encodeURIComponent(
        "Le hemos enviado un email para confirmar su cuenta. Si no lo ve revise su bandeja de spam o inténtelo de nuevo",
      ),
  );
}
