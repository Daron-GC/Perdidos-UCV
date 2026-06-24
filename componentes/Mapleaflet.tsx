
"use client";

import { useEffect, useRef, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { LatLngExpression, LeafletMouseEvent, Map as LeafletMap } from "leaflet";

const CENTER: LatLngExpression = [10.4911, -66.8902];
const BOUNDS: [[number, number], [number, number]] = [
  [10.4812, -66.8959],
  [10.4968, -66.8801],
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
  const map = useMap();
  const onLongPressRef = useRef(onLongPress);
  const timerRef = useRef<number | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const moveThreshold = 10;

  useEffect(() => {
    onLongPressRef.current = onLongPress;
  }, [onLongPress]);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startPointRef.current = null;
  };

  useEffect(() => {
    if (!map) return;

    const handleMouseDown = (event: LeafletMouseEvent) => {
      startPointRef.current = {
        x: event.originalEvent.clientX,
        y: event.originalEvent.clientY,
      };
      timerRef.current = window.setTimeout(() => {
        onLongPressRef.current?.({ lat: event.latlng.lat, lng: event.latlng.lng });
        clearTimer();
      }, 5000);
    };

    const handleMouseMove = (event: LeafletMouseEvent) => {
      if (!timerRef.current || !startPointRef.current) return;
      const distance = Math.hypot(
        event.originalEvent.clientX - startPointRef.current.x,
        event.originalEvent.clientY - startPointRef.current.y
      );
      if (distance > moveThreshold) {
        clearTimer();
      }
    };

    const handleMouseUp = () => {
      clearTimer();
    };

    const handleMouseOut = () => {
      clearTimer();
    };

    map.on({
      mousedown: handleMouseDown,
      mousemove: handleMouseMove,
      mouseup: handleMouseUp,
      mouseout: handleMouseOut,
    });

    return () => {
      map.off({
        mousedown: handleMouseDown,
        mousemove: handleMouseMove,
        mouseup: handleMouseUp,
        mouseout: handleMouseOut,
      });
      clearTimer();
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;
    const container = map.getContainer();
    if (!container) return;

    const getTouchPoint = (touch: Touch) => {
      const rect = container.getBoundingClientRect();
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    };

    const getTouchCoords = (touch: Touch) => ({
      x: touch.clientX,
      y: touch.clientY,
    });

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches?.[0] ?? event.changedTouches?.[0];
      if (!touch) return;
      startPointRef.current = getTouchCoords(touch);
      const point = getTouchPoint(touch);
      const latlng = map.containerPointToLatLng([point.x, point.y]);
      timerRef.current = window.setTimeout(() => {
        onLongPressRef.current?.({ lat: latlng.lat, lng: latlng.lng });
        clearTimer();
      }, 5000);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!timerRef.current || !startPointRef.current) return;
      const touch = event.touches?.[0] ?? event.changedTouches?.[0];
      if (!touch) return;
      const current = getTouchCoords(touch);
      const distance = Math.hypot(
        current.x - startPointRef.current.x,
        current.y - startPointRef.current.y
      );
      if (distance > moveThreshold) {
        clearTimer();
      }
    };

    const handleTouchEnd = () => {
      clearTimer();
    };

    const handleTouchCancel = () => {
      clearTimer();
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchCancel);
      clearTimer();
    };
  }, [map]);

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
      maxZoom={20}
      zoomAnimation={true}
      fadeAnimation={false}
      markerZoomAnimation={true}
      zoomSnap={0}
      zoomDelta={1}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapReadyHandler onMapReady={onMapReady} />
      <MapEvents onZoomChanged={onZoomChanged} />
      <MapLongPressHandler onLongPress={onLongPress} />
      <LocationTracker />
      {children}
    </MapContainer>
  );
}