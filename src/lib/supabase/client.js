import { createBrowserClient } from "@supabase/ssr";

/* Este cliente se usa dentro de Client Components (los que empiezan con "use client"), por ejemplo para suscripciones en tiempo real o cuando el propio navegador del usuario necesita hablar con Supabase.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
