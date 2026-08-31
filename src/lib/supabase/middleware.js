import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/api/auth"];

/**
 * Comprueba si una ruta determinada coincide con una ruta publica
 * de la aplicacion
 * @param {string} pathname - URL de la ruta a comprobar
 * @returns {boolean} true si la URL indicada es una ruta publica de la aplicacion, false en caso contrario
 */
function isPublicPath(pathname) {
  return PUBLIC_PATHS.some((path) =>
    path === "/"
      ? pathname === "/"
      : pathname === path || pathname.startsWith(`${path}/`),
  );
}

/**
 * Refresca el token de sesion del usuario en cada peticion y
 * protege de usuarios no autenticados las rutas que no son
 * publicas
 * @param {NextRequest} request - Peticion http del usuario
 * @returns {NextResponse<unknown>} La respuesta a la peticion
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

  if (!user && !isPublicPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
