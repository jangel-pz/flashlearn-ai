import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/* Se ejecuta en cada petición (antes de renderizar la página) y refresca el token de sesión del usuario. Sin esto, la gente podría ser desconectada de forma aleatoria cuando el token caduca a mitad de uso.
 */
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  /* Importante: no metas lógica propia entre createServerClient() y getUser(). Un simple descuido aquí puede hacer que usuarios se desconecten sin motivo aparente, y es un error muy difícil de rastrear.
  await supabase.auth.getUser()
  */

  return supabaseResponse;
}
