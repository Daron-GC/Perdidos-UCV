import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

type Params = {
  params: {
    id: string;
  };
};

export default async function UbicacionPage({ params }: Params) {
  const supabase = await createClient();
  const id = Number(params.id);

  if (!Number.isFinite(id)) {
    notFound();
  }

  const { data, error } = await supabase
    .from("ubicaciones")
    .select("id, nombre_ubicacion, descripcion, latitud, longitud")
    .eq("id", id)
    .limit(1)
    .single();

  if (error || !data) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[32px] bg-white p-8 shadow-[0_28px_80px_rgba(125,83,199,0.12)]">
        <h1 className="text-3xl font-bold text-[#2C2D4A] mb-4">{data.nombre_ubicacion}</h1>
        <p className="text-sm text-slate-600 mb-6">{data.descripcion || "Descripción no disponible."}</p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-[#EDE9FE] bg-[#F4F3FF] p-5">
            <p className="text-sm text-slate-500">Latitud</p>
            <p className="mt-2 text-lg font-semibold text-[#2C2D4A]">{data.latitud ?? "-"}</p>
          </div>
          <div className="rounded-3xl border border-[#EDE9FE] bg-[#F4F3FF] p-5">
            <p className="text-sm text-slate-500">Longitud</p>
            <p className="mt-2 text-lg font-semibold text-[#2C2D4A]">{data.longitud ?? "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
