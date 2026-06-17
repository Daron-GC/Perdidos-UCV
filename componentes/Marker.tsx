"use client";

import { Marker, Popup } from "react-leaflet";

interface Ubicacion {
  id_de_la_ubicacion: number;
  nombre_de_la_ubicacion: string;
  horarios?: string | null;
  latitud: number;
  longitud: number;
  descripcion?: string | null;
}

export default function Markers({
  ubicaciones,
  onSelectUbicacion,
}: {
  ubicaciones: Ubicacion[];
  onSelectUbicacion: (ubicacion: Ubicacion) => void;
}) {
  return (
    <>
      {ubicaciones.map((u) => (
        <Marker
          key={u.id_de_la_ubicacion}
          position={[Number(u.latitud), Number(u.longitud)]}
          riseOnHover
          title={u.nombre_de_la_ubicacion}
          eventHandlers={{
            click: () => onSelectUbicacion(u),
          }}
        >
          <Popup>
            <div className="space-y-1">
              <strong>{u.nombre_de_la_ubicacion}</strong>
              {u.horarios ? <p>{u.horarios}</p> : null}
              {u.descripcion ? <p>{u.descripcion}</p> : null}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}