import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/* Supabase manda al usuario a ESTA url cuando pulsa el enlace de confirmación que le llega por email. Aquí se canjea el "token_hash" del enlace por una sesión real.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/dashboard";

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  const errorMessage = encodeURIComponent(
    "El enlace de confirmación no es válido o ha caducado",
  );
  return NextResponse.redirect(`${origin}/login?error=${errorMessage}`);
}
