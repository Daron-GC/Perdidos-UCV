import { createClient } from '@/lib/supabase'
  
const supabase = createClient()

type Coordenadas = {
  lat: number;
  lng: number;
};


 // UBICACIONES


// Leer todas las ubicaciones
export const getUbicaciones = async () => {
  // aquí va función leer ubicaciones
  const { data, error } = await supabase
    .from("Ubicaciones")
    .select("*");

  if (error) throw error;
  return data;
};


// Leer una ubicación por ID
export const getUbicacionById = async (id: string) => {
  
  const { data, error } = await supabase
    .from("Ubicaciones")
    .select("*")
    .eq("id_de_la_ubicacion", id)
    .single();

  if (error) throw error;
  return data;
};


// Crear ubicación
export const createUbicacion = async (ubicacion: {
  Nombre_de_la_ubicacion: string;
  Horario: string;
  Descripción: string;
  coordenadas: Coordenadas;
}) => {
  // aquí va función crear ubicación
  const { data, error } = await supabase
    .from("Ubicaciones")
    .insert([ubicacion])
    .select();

  if (error) throw error;
  return data;
};



export const updateUbicacion = async (
  id: string,
  updates: Partial<{
    Nombre_de_la_ubicacion: string;
    Horario: string;
    Descripción: string;
    coordenadas: Coordenadas;
  }>
) => {
  
  const { data, error } = await supabase
    .from("Ubicaciones")
    .update(updates)
    .eq("id_de_la_ubicacion", id)
    .select();

  if (error) throw error;
  return data;
};


// Eliminar ubicación
export const deleteUbicacion = async (id: string) => {
  
  const { data, error } = await supabase
    .from("Ubicaciones")
    .delete()
    .eq("id_de_la_ubicacion", id);

  if (error) throw error;
  return data;
};

//  COMENTARIOS


// Leer comentarios por ubicación
export const getComentarios = async (ubicacionId: string) => {
  
  const { data, error } = await supabase
    .from("Comentarios")
    .select("*")
    .eq("ubicacion_id", ubicacionId);

  if (error) throw error;
  return data;
};


// Crear comentario
export const createComentario = async (comentario: {
  contenido: string;
  Nombre_de_usuario: string;
  ubicacion_id: string;
}) => {
  // aquí va función crear comentario
  const { data, error } = await supabase
    .from("Comentarios")
    .insert([
      {
        ...comentario,
        me_gusta: 0
      }
    ])
    .select();

  if (error) throw error;
  return data;
};


// Dar like a comentario
export const likeComentario = async (id: string, currentLikes: number) => {
  // aquí va función like comentario
  const { data, error } = await supabase
    .from("Comentarios")
    .update({
      me_gusta: currentLikes + 1
    })
    .eq("id", id)
    .select();

  if (error) throw error;
  return data;
};


// Eliminar comentario
export const deleteComentario = async (id: string) => {
  // aquí va función eliminar comentario
  const { data, error } = await supabase
    .from("Comentarios")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return data;
};
