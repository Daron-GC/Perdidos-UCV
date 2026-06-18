"use client";

import { divIcon } from "leaflet";
import { Marker, Popup } from "react-leaflet";

interface Ubicacion {
  id_de_la_ubicacion: number;
  nombre_de_la_ubicacion: string;
  horarios?: string | null;
  latitud: number;
  longitud?: number;
  logitud?: number;
  descripcion?: string | null;
}

const createDecorativeIcon = () =>
  divIcon({
    html: `
      <div style="position: relative; width: 38px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; background: #fff; border-radius: 999px; box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);"></div>
        <svg width="38" height="44" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pin-gradient" x1="8" y1="4" x2="40" y2="52" gradientUnits="userSpaceOnUse">
              <stop stop-color="#A855F7" />
              <stop offset="1" stop-color="#EC4899" />
            </linearGradient>
          </defs>
          <path d="M24 3C14.6112 3 7 10.6112 7 20C7 27.1967 12.2181 35.7735 18.43 42.8041C20.8681 45.714 27.1319 45.714 29.57 42.8041C35.7819 35.7735 41 27.1967 41 20C41 10.6112 33.3888 3 24 3Z" fill="url(#pin-gradient)"/>
          <path d="M24 8.5C16.5442 8.5 10.5 14.5442 10.5 22C10.5 25.733 12.4495 29.2038 15.5379 31.7475C17.8931 33.7993 20.5574 35.2034 24 35.2034C27.4426 35.2034 30.1069 33.7993 32.4621 31.7475C35.5505 29.2038 37.5 25.733 37.5 22C37.5 14.5442 31.4558 8.5 24 8.5Z" fill="#F5D0FE" fill-opacity="0.22"/>
          <circle cx="24" cy="21" r="6.5" fill="#FFFFFF"/>
          <circle cx="24" cy="21" r="3" fill="#7C3AED"/>
          <circle cx="30.5" cy="14" r="1.8" fill="#F9A8D4"/>
        </svg>
      </div>
    `,
    className: "decorative-pin",
    iconSize: [38, 44],
    iconAnchor: [19, 42],
    popupAnchor: [0, -36],
  });

export default function Markers({
  ubicaciones,
  onSelectUbicacion,
}: {
  ubicaciones: Ubicacion[];
  onSelectUbicacion?: (ubicacion: Ubicacion) => void;
}) {
  return (
    <>
      {ubicaciones.map((u) => {
        const lat = Number(u.latitud);
        const lng = Number(u.longitud ?? u.logitud);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return null;
        }

        return (
          <Marker
            key={u.id_de_la_ubicacion}
            position={[lat, lng]}
            icon={createDecorativeIcon()}
            riseOnHover
            title={u.nombre_de_la_ubicacion}
            eventHandlers={{
              click: () => onSelectUbicacion?.(u),
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
        );
      })}
    </>
  );
}