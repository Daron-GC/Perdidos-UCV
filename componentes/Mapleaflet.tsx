
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";

interface UbicacionSupabase {
  id_de_la_ubicacion: number;
  nombre_de_la_ubicacion: string;
  horarios?: string | null;
  logitud: number;
  latitud: number;
  descripcion?: string | null;
}

const CENTER: LatLngExpression = [10.4907341, -66.8900546];

function LocationTracker() {
  const map = useMap();
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const nextPosition: LatLngExpression = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(nextPosition);
        map.flyTo(nextPosition, 17, { duration: 1.2 });
      },
      (error) => {
        console.error("Error obteniendo ubicación:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  return position ? (
    <Marker position={position}>
      <Popup>Tu ubicación actual</Popup>
    </Marker>
  ) : null;
}

export default function MapLeaflet({
  children,
}: {
  children?: React.ReactNode;
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
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationTracker />
      {children}
    </MapContainer>
  );
}