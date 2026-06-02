import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Ejecuta la lógica de refresco de sesión en cada solicitud
  return await updateSession(request)
}

async function updateSession(request: NextRequest) {
  // TODO: reemplazar con la lógica real de refresco de sesión
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Ejecutar en todas las rutas excepto las estáticas y API
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
