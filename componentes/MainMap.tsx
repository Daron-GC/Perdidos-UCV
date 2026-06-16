"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import Markers from "./Marker";

const ubicaciones = [
  { id: 1, nombre: "Biblioteca Central", latitud: 10.4917, longitud: -66.8812 },
  { id: 2, nombre: "Facultad de Ciencias", latitud: 10.4930, longitud: -66.8835 },
  { id: 3, nombre: "Cafetería UCV", latitud: 10.4920, longitud: -66.8790 },
  { id: 4, nombre: "Aula Magna", latitud: 10.4895, longitud: -66.8818 },
];

export default function MainMap({
  user,
  children,
}: {
  user?: any;
  children?: React.ReactNode;
}) {
  const bounds: [[number, number], [number, number]] = [
    [10.478, -66.892],
    [10.504, -66.861],
  ];

  const showMarkers = false;

  return (
    <MapContainer
      center={[10.491, -66.881]}
      zoom={16}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {showMarkers && <Markers ubicaciones={ubicaciones} />}
      {children}
    </MapContainer>
  );
}
