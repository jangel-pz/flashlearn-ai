import { updateSession } from "@/lib/supabase/middleware";

/**
 * Refresca el token de sesion del usuario en cada peticion y
 * protege de usuarios no autenticados las rutas que no son
 * publicas
 * @param {NextRequest} request - Peticion http del usuario
 * @returns {NextResponse<unknown>} La respuesta a la peticion
 */
export async function middleware(request) {
  return await updateSession(request);
}

/**
 * Establece los componentes (archivos estaticos, imagenes, etc.)
 * en los que no se requiere refresco de sesion
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
