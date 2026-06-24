"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Star } from "lucide-react";

type Comentario = {
  id: number;
  contenido: string;
  destacado: boolean | null;
  ubicacion_id: number | null;
  ubicaciones?: {
    nombre_ubicacion?: string | null;
  };
};

export default function ResenasPage() {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData?.user?.email) {
          setError("Inicia sesión para ver tus reseñas.");
          return;
        }

        const email = authData.user.email;
        const { data: usuarioRows, error: usuarioError } = await supabase
          .from("usuario")
          .select("id")
          .eq("email", email)
          .limit(1)
          .maybeSingle();

        if (usuarioError || !usuarioRows?.id) {
          setError("No se pudo encontrar tu usuario en la base de datos.");
          return;
        }

        const userId = usuarioRows.id;
        const { data, error: comentariosError } = await supabase
          .from("comentarios")
          .select("id, contenido, destacado, ubicacion_id, ubicaciones(nombre_ubicacion)")
          .eq("user_id", userId)
          .order("id", { ascending: false });

        if (comentariosError) {
          setError("No se pudieron cargar tus reseñas.");
          return;
        }

        setComentarios((data as Comentario[]) || []);
      } catch (err) {
        console.error("Error cargando reseñas:", err);
        setError("Ocurrió un error al cargar tus reseñas.");
      } finally {
        setLoading(false);
      }
    };

    cargarComentarios();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-4 sm:p-8">
      <div className="mx-auto max-w-3xl rounded-[36px] bg-white p-6 shadow-lg shadow-[#7D53C7]/10 ring-1 ring-[#EDE9FE]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7D53C7] to-[#A158FF] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-[#7D53C7]/15">
              <Star size={16} className="text-white" />
              Mis Reseñas
            </div>
            <h1 className="mt-4 text-3xl font-bold text-[#1F2340]">Tus comentarios en un mismo lugar</h1>
            <p className="mt-2 max-w-2xl text-sm text-[#5B6278]">
              Revisa lo que has escrito y encuentra tus reseñas más destacadas rápidamente.
            </p>
          </div>
          <div className="rounded-3xl bg-[#7D53C7] px-4 py-3 text-sm font-semibold text-white shadow-sm">
            Total: <span className="text-[#F4F3FF]">{comentarios.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="rounded-[32px] border border-dashed border-[#A4C8FF]/30 bg-white/80 p-8 text-center text-[#5B6278] shadow-sm">
            Cargando reseñas...
          </div>
        ) : error ? (
          <div className="rounded-[32px] border border-red-200 bg-red-50 p-6 text-center text-red-700 shadow-sm">
            {error}
          </div>
        ) : comentarios.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-[#A4C8FF]/30 bg-white/80 p-8 text-center text-[#5B6278] shadow-sm">
            No has dejado reseñas aún.
          </div>
        ) : (
          <div className="space-y-4">
            {comentarios.map((comentario) => (
              <div key={comentario.id} className="overflow-hidden rounded-[28px] border border-[#EDE9FE] bg-white p-5 shadow-[0_12px_36px_rgba(125,83,199,0.08)]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#1F2340]">
                      {comentario.ubicaciones?.nombre_ubicacion || `Ubicación #${comentario.ubicacion_id ?? "-"}`}
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#F4F3FF] px-3 py-1 text-xs font-semibold text-[#7D53C7]">
                      {comentario.destacado ? "Destacado" : "Comentario"}
                    </div>
                  </div>
                  <span className="rounded-3xl bg-[#F4F3FF] px-4 py-2 text-xs font-semibold text-[#A158FF] shadow-sm">
                    ID {comentario.id}
                  </span>
                </div>
                <p className="mt-4 text-[#3A416F] whitespace-pre-line leading-7">{comentario.contenido}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
