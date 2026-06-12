'use server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function getUserProfile() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { username: null, error: 'No autenticado' }

  const { data: profile } = await supabase
    .from('user')
    .select('username')
    .eq('email', user.email)
    .single()

  if (profile) return { username: profile.username, error: null }
  return { username: user.email?.split('@')[0] || 'Usuario', error: null }
}