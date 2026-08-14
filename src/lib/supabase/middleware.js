import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Rutas que cualquiera puede visitar sin haber iniciado sesión.
const PUBLIC_PATHS = ["/", "/login", "/signup", "/api/auth"];

function isPublicPath(pathname) {
  return PUBLIC_PATHS.some((path) =>
    path === "/"
      ? pathname === "/"
      : pathname === path || pathname.startsWith(`${path}/`),
  );
}

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /* Si no hay usuario logueado y la ruta pedida no está en la lista de públicas, se redirige a /login
   */
  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
