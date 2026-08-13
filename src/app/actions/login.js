"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    redirect(
      "/login?error=" + encodeURIComponent("Rellene email y contraseña"),
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      "/login?error=" + encodeURIComponent("Email o contraseña incorrectos"),
    );
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
