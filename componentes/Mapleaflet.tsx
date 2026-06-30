
"use client";

import { useEffect, useRef, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLngExpression, Map as LeafletMap } from "leaflet";

const CENTER: LatLngExpression = [10.4911, -66.8902];
const BOUNDS: [[number, number], [number, number]] = [
  [10.4750, -66.9050],
  [10.5000, -66.8750],
];

function safeStopMap(map: LeafletMap | null) {
  try {
    if (map?.stop) {
      map.stop();
    }

    const mapWithPanAnim = map as LeafletMap & { _panAnim?: { stop?: () => void } } | null;
    if (mapWithPanAnim?._panAnim?.stop) {
      mapWithPanAnim._panAnim.stop();
    }
  } catch {
    // Evitar errores si el mapa está en proceso de destrucción.
  }
}

function MapEvents({
  onZoomChanged,
}: {
  onZoomChanged?: (zoom: number) => void;
}) {
  const map = useMapEvents({
    zoomend() {
      onZoomChanged?.(map.getZoom());
    },
  });

  useEffect(() => {
    if (!map) return;
    onZoomChanged?.(map.getZoom());
  }, [map, onZoomChanged]);

  return null;
}

function MapLongPressHandler({
  onLongPress,
}: {
  onLongPress?: (location: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    contextmenu(e) {
      onLongPress?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return null;
}

function MapReadyHandler({
  onMapReady,
}: {
  onMapReady?: (map: LeafletMap) => void;
}) {
  const map = useMap();
  const onMapReadyRef = useRef(onMapReady);

  useEffect(() => {
    onMapReadyRef.current = onMapReady;
  }, [onMapReady]);

  useEffect(() => {
    if (!map || !map.getContainer()) return;

    const container = map.getContainer();
    if (!container) return;

    const handleReady = () => {
      requestAnimationFrame(() => {
        try {
          if (container.isConnected) {
            map.invalidateSize(true);
            setTimeout(() => {
              try {
                map.invalidateSize(true);
              } catch {}
            }, 250);
          }
        } catch {}
        onMapReadyRef.current?.(map);
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
  onZoomChanged,
  onLongPress,
}: {
  children?: React.ReactNode;
  onMapReady?: (map: LeafletMap) => void;
  onZoomChanged?: (zoom: number) => void;
  onLongPress?: (location: { lat: number; lng: number }) => void;
}) {
  return (
    <MapContainer
      center={CENTER}
      bounds={BOUNDS}
      maxBounds={BOUNDS}
      maxBoundsViscosity={0.9}
      zoom={16}
      maxZoom={19}
      zoomAnimation={true}
      fadeAnimation={false}
      markerZoomAnimation={true}
      zoomSnap={0}
      zoomDelta={1}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        maxNativeZoom={19}
      />
      <MapReadyHandler onMapReady={onMapReady} />
      <MapEvents onZoomChanged={onZoomChanged} />
      <MapLongPressHandler onLongPress={onLongPress} />
      <LocationTracker />
      {children}
    </MapContainer>
  );
}