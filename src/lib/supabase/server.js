import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/* Este cliente se usa en el servidor: Server Components, Server Actions y Route Handlers. Lee (y a veces escribe) las cookies de sesión para saber qué usuario está autenticado en cada petición.
 */
export async function createClient() {
  const cookieStore = await cookies();

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
          } catch {
            /* Esto puede lanzar un error si se llama desde un Server Component puro (que no puede escribir cookies). No pasa nada: el middleware de abajo se encarga de refrescarlas.
             */
          }
        },
      },
    },
  );
}
