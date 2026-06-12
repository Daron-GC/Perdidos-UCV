"use client";

import { Marker, Popup } from "react-leaflet";
import { useRouter } from "next/navigation";

export default function Markers({ ubicaciones }: { ubicaciones: any[] }) {
  const router = useRouter();

  function abrirComentarios(id: number) {
    router.push(`/comentarios/${id}`);
  }

  return (
    <>
      {ubicaciones.map((u) => (
        <Marker
          key={u.id}
          position={[u.latitud, u.longitud]}
        >
          <Popup>
            <div>
              <strong>{u.nombre}</strong>
              <button
                onClick={() => abrirComentarios(u.id)}
                className="ml-2 text-blue-500 underline"
              >
                Ver comentarios
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}