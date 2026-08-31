import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Crea un cliente de Supabase utilizable desde componentes de
 * servidor. Gestiona las cookies de sesion para comprobar el
 * usuario autenticado en cada peticion
 * @returns {SupabaseClient<any, "public", "public", any, any>} El cliente de Supabase para entorno de servidor
 */
export async function createClient() {
  const cookieStore = await cookies();

  // La funcion se declara como deprecada por un fallo de la libreria
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}
