"use client";

import { divIcon } from "leaflet";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { useEffect, useRef } from "react";

interface Ubicacion {
  id?: number;
  id_de_la_ubicacion?: number;
  nombre_ubicacion?: string;
  nombre_de_la_ubicacion?: string;
  horarios?: string | null;
  latitud: number;
  longitud: number;
  logitud?: number;
  descripcion?: string | null;
  categoria?: number | null;
}

let pinIdCounter = 0;

const getPinColor = (categoria?: number | null) => {
  if (categoria === 5) {
    return { start: "#FBBF24", end: "#F59E0B", dot: "#FFFFFF" };
  }

  if (categoria === 4) {
    return { start: "#00BBF9", end: "#00A3E0", dot: "#FFFFFF" };
  }

  if (categoria === 3) {
    return { start: "#ADEBB3", end: "#7ED39B", dot: "#FFFFFF" };
  }

  if (categoria === 2) {
    return { start: "#F8F9FA", end: "#D9D9DB", dot: "#9CA3AF" };
  }

  return { start: "#A855F7", end: "#EC4899", dot: "#FFFFFF" };
};

const createDecorativeIcon = (categoria?: number | null, isHighlighted = false) => {
  const pinColor = getPinColor(categoria);
  const gradientId = `pin-gradient-${pinIdCounter++}`;

  return divIcon({
    html: `
      <div style="position: relative; width: 38px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; background: #fff; border-radius: 999px; box-shadow: 0 0 0 3px rgba(0, 187, 249, 0.15);"></div>
        <svg width="38" height="44" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${gradientId}" x1="8" y1="4" x2="40" y2="52" gradientUnits="userSpaceOnUse">
              <stop stop-color="${pinColor.start}" />
              <stop offset="1" stop-color="${pinColor.end}" />
            </linearGradient>
          </defs>
          <path d="M24 3C14.6112 3 7 10.6112 7 20C7 27.1967 12.2181 35.7735 18.43 42.8041C20.8681 45.714 27.1319 45.714 29.57 42.8041C35.7819 35.7735 41 27.1967 41 20C41 10.6112 33.3888 3 24 3Z" fill="url(#${gradientId})"/>
          <path d="M24 8.5C16.5442 8.5 10.5 14.5442 10.5 22C10.5 25.733 12.4495 29.2038 15.5379 31.7475C17.8931 33.7993 20.5574 35.2034 24 35.2034C27.4426 35.2034 30.1069 33.7993 32.4621 31.7475C35.5505 29.2038 37.5 25.733 37.5 22C37.5 14.5442 31.4558 8.5 24 8.5Z" fill="${categoria === 2 ? "#F3F4F6" : "#F5D0FE"}" fill-opacity="0.22"/>
          <circle cx="24" cy="21" r="6.5" fill="#FFFFFF"/>
          ${categoria === 3 ? '' : `<circle cx="24" cy="21" r="3" fill="${pinColor.dot}"/>`}
        </svg>
        ${categoria === 3 ? `<img src="/pin-cafe.png" style="position:absolute; top:12px; left:50%; width:16px; height:16px; transform:translateX(-50%); pointer-events:none;" alt="cafetería" />` : ''}
      </div>
    `,
    className: "decorative-pin",
    iconSize: [38, 44],
    iconAnchor: [19, 42],
    popupAnchor: [0, -36],
  });
};

export default function Markers({
  ubicaciones,
  onSelectUbicacion,
  selectedLocationId,
  highlightLocationId,
  zoomLevel = 16,
}: {
  ubicaciones: Ubicacion[];
  onSelectUbicacion?: (ubicacion: Ubicacion) => void;
  selectedLocationId?: number | null;
  highlightLocationId?: number | null;
  zoomLevel?: number;
}) {
  const visibleUbicaciones = ubicaciones;

  return (
    <>
      {visibleUbicaciones.map((u) => {
        const lat = Number(u.latitud);
        const lng = Number(u.longitud ?? u.logitud);
        const ubicacionId = u.id ?? u.id_de_la_ubicacion;
        const ubicacionName = u.nombre_ubicacion || u.nombre_de_la_ubicacion || "Ubicación";

        if (!Number.isFinite(lat) || !Number.isFinite(lng) || !ubicacionId) {
          return null;
        }

        const isHighlighted = highlightLocationId != null && Number(ubicacionId) === highlightLocationId;
        const labelOpacity = Math.min(Math.max((zoomLevel - 14) / 2, 0), 1);
        const showLabel = labelOpacity > 0 && (zoomLevel >= 15 || isHighlighted);

        return (
          <Marker
            key={ubicacionId}
            position={[lat, lng]}
            icon={createDecorativeIcon(Number(u.categoria ?? null), isHighlighted)}
            riseOnHover
            title={ubicacionName}
            eventHandlers={{
              click: () => onSelectUbicacion?.(u),
            }}
          >
            <Tooltip
              direction="top"
              offset={[0, -28]}
              opacity={showLabel ? labelOpacity : 0}
              permanent={true}
              className="marker-tooltip"
              interactive={false}
            >
              <span
                style={{
                  opacity: showLabel ? labelOpacity : 0,
                  transition: "opacity 0.25s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {ubicacionName}
              </span>
            </Tooltip>
            <Popup>
              <div className="space-y-1">
                <strong>{ubicacionName}</strong>
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