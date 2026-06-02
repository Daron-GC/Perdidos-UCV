// utils/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies() // Acceso asíncrono a cookies en Next.js 15+

  // Crea un cliente que puede leer/escribir cookies en el servidor
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Esto sucede si se intenta configurar cookies desde un Server Component.
            // Las cookies solo se pueden configurar en Actions o Route Handlers.
          }
        },
      },
    }
  )
}

