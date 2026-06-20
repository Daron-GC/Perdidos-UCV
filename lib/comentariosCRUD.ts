import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export type Comentario = {
  id: number;
  contenido: string;
  user_id?: number | null;
  verificado?: boolean | null;
  liked?: boolean | null;
  username?: string | null;
  ubicaciones_id?: number | null;
};

export type Ubicacion = {
  id_de_la_ubicacion: number;
  nombre_de_la_ubicacion?: string | null;
  descripcion?: string | null;
  horarios?: string | null;
  latitud?: number | null;
  longitud?: number | null;
};

export async function leerComentarios() {
  const { data, error } = await supabase
    .from("comentarios")
    .select(
      "id, contenido, user_id, verificado, liked, username, ubicaciones_id"
    )
    .order("id", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as Comentario[];
}

export async function crearComentario(
  contenido: string,
  ubicaciones_id: number,
  username = "Usuario"
) {
  const texto = contenido.trim();

  if (!texto) {
    throw new Error("El comentario no puede estar vacío.");
  }

  if (!ubicaciones_id) {
    throw new Error("La ubicación es obligatoria para publicar.");
  }

  const { data, error } = await supabase
    .from("comentarios")
    .insert([
      {
        contenido: texto,
        username,
        verificado: false,
        liked: false,
        ubicaciones_id,
      },
    ])
    .select(
      "id, contenido, user_id, verificado, liked, username, ubicaciones_id"
    );

  if (error) {
    throw error;
  }

  return (data?.[0] ?? null) as Comentario | null;
}

export async function actualizarComentario(
  id: number,
  cambios: Partial<Comentario>
) {
  const { data, error } = await supabase
    .from("comentarios")
    .update(cambios)
    .eq("id", id)
    .select(
      "id, contenido, user_id, verificado, liked, username, ubicaciones_id"
    );

  if (error) {
    throw error;
  }

  return (data?.[0] ?? null) as Comentario | null;
}

export async function eliminarComentario(id: number) {
  const { error } = await supabase.from("comentarios").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function crearUbicacion(payload: {
  nombre_de_la_ubicacion: string;
  descripcion?: string;
  horarios?: string;
  latitud?: number | null;
  longitud?: number | null;
}) {
  const { data, error } = await supabase
    .from("ubicaciones")
    .insert([
      {
        nombre_de_la_ubicacion: payload.nombre_de_la_ubicacion,
        descripcion: payload.descripcion ?? "Sin descripción disponible.",
        horarios: payload.horarios ?? null,
        latitud: payload.latitud ?? null,
        longitud: payload.longitud ?? null,
      },
    ])
    .select("id_de_la_ubicacion, nombre_de_la_ubicacion, descripcion")
    .single();

  if (error) {
    throw error;
  }

  return data as Ubicacion;
}
