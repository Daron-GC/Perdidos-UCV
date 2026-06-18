
"use client";

import { useEffect, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import { LatLngExpression } from "leaflet";

const CENTER: LatLngExpression = [10.4907341, -66.8900546];

function MapReadyHandler({
  onMapReady,
}: {
  onMapReady?: (map: any) => void;
}) {
  const map = useMap();

  useEffect(() => {
    onMapReady?.(map);
  }, [map, onMapReady]);

  return null;
}

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
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapReadyHandler onMapReady={onMapReady} />
      <LocationTracker />
      {children}
    </MapContainer>
  );
}