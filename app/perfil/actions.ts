// app/perfil/actions.ts
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function getUserProfile() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return {
      email: null,
      username: null,
      rating: null,
      comments_count: 0,
      likes_count: 0,
      faculty_name: null,
      error: 'No autenticado',
    }
  }

  const authEmail = user.email?.trim() ?? null

  if (!authEmail) {
    return {
      email: null,
      username: null,
      rating: null,
      comments_count: 0,
      likes_count: 0,
      faculty_name: null,
      error: 'No hay email en la sesión',
    }
  }

  const { data: usuarioData, error: usuarioError } = await supabase
    .from('usuario')
    .select('id, email, facultad_id')
    .eq('email', authEmail)
    .maybeSingle()

  const emailFromTable = usuarioData?.email ?? null

  if (usuarioError) {
    return {
      email: emailFromTable ?? authEmail,
      username: emailFromTable ?? authEmail,
      rating: null,
      comments_count: 0,
      likes_count: 0,
      faculty_name: null,
      error: 'Error al consultar la tabla usuario',
    }
  }

  if (!usuarioData) {
    return {
      email: authEmail,
      username: authEmail,
      rating: null,
      comments_count: 0,
      likes_count: 0,
      faculty_name: null,
      error: 'No existe el usuario en public.usuario',
    }
  }

  const userId = usuarioData.id
  let facultyName: string | null = null

  if (usuarioData.facultad_id) {
    const { data: facultadData } = await supabase
      .from('ubicaciones')
      .select('nombre_ubicacion')
      .eq('id', usuarioData.facultad_id)
      .maybeSingle()

    facultyName = facultadData?.nombre_ubicacion ?? null
  }

  let commentsCount = 0
  let likesCount = 0

  const { data: commentsData, error: commentsError } = await supabase
    .from('comentarios')
    .select('id')
    .eq('user_id', userId)

  if (!commentsError && commentsData) {
    const commentIds = (commentsData as Array<{ id: number }>).map((comment) => comment.id)
    commentsCount = commentIds.length

    if (commentIds.length > 0) {
      const { data: likesData, error: likesError } = await supabase
        .from('like')
        .select('id')
        .in('id_comentario', commentIds)

      if (!likesError && likesData) {
        likesCount = likesData.length
      }
    }
  }

  const rating = likesCount > 0
    ? Number((likesCount / 10).toFixed(1))
    : 0.0

  return {
    email: usuarioData.email,
    username: usuarioData.email,
    rating,
    comments_count: commentsCount,
    likes_count: likesCount,
    faculty_name: facultyName,
    error: null,
  }
}
export async function logoutAction() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
}