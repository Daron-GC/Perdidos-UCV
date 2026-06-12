// app/perfil/actions.ts
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function getUserProfile() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('Error obteniendo usuario:', userError)
    return { username: null, error: 'No autenticado' }
  }

  console.log('Usuario autenticado:', user.email) // ← verifica en consola del servidor

  // 🔁 CAMBIA 'user' por el nombre REAL de tu tabla (ej. 'profiles')
  // 🔁 CAMBIA 'username' por el nombre REAL de la columna (ej. 'full_name')
  const { data: profile, error: profileError } = await supabase
    .from('user')        // ← ¿Es 'user' o 'profiles'?
    .select('username')  // ← ¿Es 'username' o 'full_name'?
    .eq('email', user.email)
    .single()

  if (profileError) {
    console.error('Error buscando perfil:', profileError)
    // No existe perfil: usar email como nombre de usuario
    const fallback = user.email?.split('@')[0] || 'Usuario'
    return { username: fallback, error: null }
  }

  console.log('Perfil encontrado:', profile) // ← verifica
  return { username: profile.username, error: null }
}