"use client";

import { Marker, Popup } from "react-leaflet";
import { useRouter } from "next/navigation";

interface Ubicacion {
  id: number;
  nombre: string;
  latitud: number;
  longitud: number;
}

export default function Markers({
  ubicaciones,
}: {
  ubicaciones: Ubicacion[];
}) {
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
          eventHandlers={{
            click: () => abrirComentarios(u.id),
          }}
        >
          <Popup>{u.nombre}</Popup>
        </Marker>
      ))}
    </>
  );
}