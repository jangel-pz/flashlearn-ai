"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Inicia sesion con la cuenta de usuario seleccionada
 * (email + contraseña)
 * @param {Array<string>} formData - Contenido de los campos 'Email' y 'Contraseña' del formulario de registro
 */
export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    redirect(
      "/login?type=error&message=" +
        encodeURIComponent("Rellene email y contraseña"),
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      "/login?type=error&message=" +
        encodeURIComponent("Email o contraseña incorrectos"),
    );
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Cierra la sesion de la cuenta de usuario en curso y redirige
 * a la pantalla de login
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
