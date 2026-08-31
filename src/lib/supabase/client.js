import { createBrowserClient } from "@supabase/ssr";

/**
 * Crea un cliente de Supabase utilizable desde el navegador
 * @returns {SupabaseClient<any, "public", "public", any, any>} El cliente de Supabase para entorno de navegador
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
