
"use client";

import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";

const CENTER: LatLngExpression = [10.4907341, -66.8900546];

function safeStopMap(map: any) {
  try {
    if (map?.stop) {
      map.stop();
    }

    if (map?._panAnim?.stop) {
      map._panAnim.stop();
    }
  } catch {
    // Evitar errores si el mapa está en proceso de destrucción.
  }
}

function MapReadyHandler({
  onMapReady,
}: {
  onMapReady?: (map: any) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !map.getContainer()) return;

    const container = map.getContainer();
    if (!container) return;

    const handleReady = () => {
      requestAnimationFrame(() => {
        try {
          if (container.isConnected) {
            map.invalidateSize();
          }
        } catch {}
        onMapReady?.(map);
      });
    };

    map.whenReady(handleReady);

    return () => {
      safeStopMap(map);
    };
  }, [map]);

  return null;
}

function LocationTracker() {
  const map = useMap();
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    if (!navigator.geolocation || !map) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const nextPosition: LatLngExpression = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(nextPosition);

        if (
          Number.isFinite(nextPosition[0]) &&
          Number.isFinite(nextPosition[1])
        ) {
          // Se mantiene el marcador de ubicación sin forzar un nuevo pan del mapa.
          // Esto evita disparar la transición que produce el error de Leaflet.
        }
      },
      (error) => {
        const message =
          error.code === 1
            ? "Permiso de ubicación denegado."
            : error.code === 2
              ? "La ubicación no está disponible en este momento."
              : error.code === 3
                ? "Tiempo de espera agotado al obtener la ubicación."
                : error.message || "No se pudo obtener la ubicación.";

        if (error.code !== 1) {
          console.warn(`Geolocalización: ${message}`);
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      safeStopMap(map);
    };
  }, [map]);

  return position ? (
    <CircleMarker
      center={position}
      radius={10}
      pathOptions={{
        color: "#0ea5e9",
        fillColor: "#38bdf8",
        fillOpacity: 0.9,
        weight: 3,
      }}
    >
      <Popup>Tu ubicación actual</Popup>
    </CircleMarker>
  ) : null;
}

export default function MapLeaflet({
  children,
  onMapReady,
}: {
  children?: React.ReactNode;
  onMapReady?: (map: any) => void;
}) {
  const bounds: [[number, number], [number, number]] = [
    [10.478, -66.892],
    [10.504, -66.861],
  ];

  return (
    <MapContainer
      center={CENTER}
      zoom={16}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
      zoomAnimation={false}
      fadeAnimation={false}
      markerZoomAnimation={false}
      zoomSnap={0}
      zoomDelta={1}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapReadyHandler onMapReady={onMapReady} />
      <LocationTracker />
      {children}
    </MapContainer>
  );
}