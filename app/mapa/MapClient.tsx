"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { supabase } from "@/lib/supabase";

const MapLeaflet = dynamic(() => import("@/componentes/Mapleaflet"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#eef5f3]">
      <p className="text-sm text-slate-500">Cargando mapa...</p>
    </div>
  ),
});

const Markers = dynamic(() => import("@/componentes/Marker"), {
  ssr: false,
});

const INITIAL_MAP_CENTER: [number, number] = [10.4911, -66.8902];

const FALLBACK_UBICACIONES = [
  {
    id: 1,
    id_de_la_ubicacion: 1,
    horarios: "7:00 am , 7:00pm",
    descripcion: "Facultad de arquitectura de la ucv ",
    nombre_ubicacion: "Facultad de Arquitectura y Urbanismo ",
    nombre_de_la_ubicacion: "Facultad de Arquitectura y Urbanismo ",
    latitud: 10.4899653376888,
    longitud: -66.8874361002191,
  },
  {
    id: 2,
    id_de_la_ubicacion: 2,
    horarios: "7:00am 7:00pm",
    descripcion: "increible ",
    nombre_ubicacion: "ciclo básico de  ingeniería ",
    nombre_de_la_ubicacion: "ciclo básico de  ingeniería ",
    latitud: 10.4903165443207,
    longitud: -66.8886954009572,
  },
  {
    id: 3,
    id_de_la_ubicacion: 3,
    horarios: "7:00am 7:00pm",
    descripcion: "Narnia ",
    nombre_ubicacion: "Facultad de ciencias ",
    nombre_de_la_ubicacion: "Facultad de ciencias ",
    latitud: 10.4857008822901,
    longitud: -66.8909312764693,
  },
];

export default function MapClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [ubicaciones, setUbicaciones] = useState<any[]>(FALLBACK_UBICACIONES);
  const [selectedUbicacion, setSelectedUbicacion] = useState<any | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(16);
  const [pendingPinLocation, setPendingPinLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pinName, setPinName] = useState("");
  const [pinDescription, setPinDescription] = useState("");
  const [pinError, setPinError] = useState("");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const mapRef = useRef<any>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const hasAutoZoomedRef = useRef(false);

  const selectedLocationId = useMemo(() => {
    const raw = searchParams.get("ubicacionId");
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }, [searchParams]);

  const selectedLocationName = useMemo(
    () => searchParams.get("ubicacionNombre") || "",
    [searchParams]
  );

  const selectedLat = useMemo(() => {
    const raw = searchParams.get("latitud");
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }, [searchParams]);

  const selectedLng = useMemo(() => {
    const raw = searchParams.get("longitud");
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }, [searchParams]);

  const handleMapReady = useCallback((map: any) => {
    mapRef.current = map;
    hasAutoZoomedRef.current = false;
    setMapReady(true);
  }, []);

  const handleMapLongPress = useCallback((location: { lat: number; lng: number }) => {
    setPendingPinLocation(location);
    setPinName("");
    setPinDescription("");
    setPinError("");
    setIsPinModalOpen(true);
  }, []);

  const formatDateTime = (date: Date) => {
    const pad = (value: number) => String(value).padStart(2, "0");
    return {
      fecha: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
      hora: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
    };
  };

  const isValidTemporalPin = (item: any) => {
    if (!item.temporal) return true;
    if (!item.fecha || !item.hora) return false;

    const parsed = new Date(`${item.fecha}T${item.hora}:00`);
    if (Number.isNaN(parsed.getTime())) return false;

    return Date.now() - parsed.getTime() < 24 * 60 * 60 * 1000;
  };

  const handleCreateTemporaryPin = async () => {
    if (!pendingPinLocation) return;

    const trimmedName = pinName.trim();
    const trimmedDescription = pinDescription.trim();

    if (trimmedName.length === 0) {
      setPinError("Ingresa un nombre para el pin temporal.");
      return;
    }

    const now = new Date();
    const { fecha, hora } = formatDateTime(now);

    try {
      const { data, error } = await supabase
        .from("ubicaciones")
        .insert([
          {
            nombre_ubicacion: trimmedName,
            descripcion: trimmedDescription,
            latitud: pendingPinLocation.lat,
            longitud: pendingPinLocation.lng,
            temporal: true,
            fecha,
            hora,
            categoria: 5,
          },
        ])
        .select(
          "id, nombre_ubicacion, horarios, descripcion, latitud, longitud, temporal, fecha, hora"
        )
        .single();

      if (error) {
        throw error;
      }

      const inserted: any = data;
      if (inserted) {
        setUbicaciones((prev) => [
          {
            id: inserted.id,
            id_de_la_ubicacion: inserted.id,
            nombre_ubicacion: inserted.nombre_ubicacion,
            nombre_de_la_ubicacion: inserted.nombre_ubicacion,
            horarios: inserted.horarios ?? null,
            descripcion: inserted.descripcion ?? null,
            latitud: Number(inserted.latitud),
            longitud: Number(inserted.longitud),
            categoria: 5,
            temporal: true,
            fecha: inserted.fecha ?? fecha,
            hora: inserted.hora ?? hora,
          },
          ...prev,
        ]);
      }

      setIsPinModalOpen(false);
      setPendingPinLocation(null);
      setPinName("");
      setPinDescription("");
      setPinError("");
    } catch (error) {
      console.error("Error creando pin temporal:", error);
      setPinError("No se pudo crear el pin temporal. Intenta de nuevo.");
    }
  };

  const handleCenterOnUser = () => {
    if (!navigator.geolocation || !mapRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const map = mapRef.current;
        if (!map || !map.getContainer()) return;

        try {
          map.stop();
          map.invalidateSize();
          map.setView(
            [position.coords.latitude, position.coords.longitude],
            17,
            { animate: false }
          );
        } catch (error) {
          console.warn("No se pudo centrar el mapa:", error);
        }
      },
      (error) => {
        const message =
          error?.message ||
          (typeof error === "object" ? JSON.stringify(error) : String(error));
        console.error("Error centrándose en la ubicación:", message, error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  useEffect(() => {
    async function cargarUbicaciones() {
      try {
        const { data, error } = await supabase
          .from("ubicaciones")
          .select(
            "id, nombre_ubicacion, horarios, longitud, latitud, descripcion, categoria, temporal, fecha, hora"
          );

        if (error) {
          setUbicaciones(FALLBACK_UBICACIONES);
          return;
        }

        const datosFormateados = (data || [])
          .map((item: any) => ({
            id: item.id,
            id_de_la_ubicacion: item.id,
            nombre_ubicacion: item.nombre_ubicacion,
            nombre_de_la_ubicacion: item.nombre_ubicacion,
            horarios: item.horarios,
            longitud: Number(item.longitud),
            latitud: Number(item.latitud),
            descripcion: item.descripcion,
            categoria: item.categoria != null ? Number(item.categoria) : null,
            temporal: item.temporal === true,
            fecha: item.fecha ?? null,
            hora: item.hora ?? null,
          }))
          .filter(
            (item) =>
              Number.isFinite(item.longitud) &&
              Number.isFinite(item.latitud) &&
              isValidTemporalPin(item)
          );

        setUbicaciones(
          datosFormateados.length > 0 ? datosFormateados : FALLBACK_UBICACIONES
        );
      } catch (error) {
        setUbicaciones(FALLBACK_UBICACIONES);
      }
    }

    cargarUbicaciones();
  }, []);

  useEffect(() => {
    const term = debouncedSearch.trim();

    if (term.length === 0) {
      setSearchResults([]);
      setSearchLoading(false);
      setShowSearchDropdown(false);
      return;
    }

    let active = true;

    const fetchSuggestions = async () => {
      setSearchLoading(true);
      const { data, error } = await supabase
        .from("ubicaciones")
        .select("id, nombre_ubicacion, latitud, longitud, categoria, descripcion")
        .or(`nombre_ubicacion.ilike.%${term}%,descripcion.ilike.%${term}%`)
        .limit(8);

      if (!active) return;
      setSearchLoading(false);

      if (error) {
        console.error("Error buscando ubicaciones:", error);
        setSearchResults([]);
        return;
      }

      setSearchResults(
        (data ?? []).map((item: any) => ({
          ...item,
          latitud: Number(item.latitud),
          longitud: Number(item.longitud),
          categoria: item.categoria != null ? Number(item.categoria) : null,
        }))
      );
      setShowSearchDropdown(true);
    };

    fetchSuggestions();

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!searchWrapperRef.current) return;
      if (event.target instanceof Node && !searchWrapperRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectSearchLocation = (ubicacion: any) => {
    setSearch(ubicacion.nombre_ubicacion || "");
    setShowSearchDropdown(false);
    setSelectedUbicacion(ubicacion);

    if (mapRef.current && Number.isFinite(ubicacion.latitud) && Number.isFinite(ubicacion.longitud)) {
      try {
        mapRef.current.flyTo([ubicacion.latitud, ubicacion.longitud], 17, {
          animate: true,
          duration: 1.2,
        });
      } catch {}
    }
  };

  useEffect(() => {
    if (!mapReady || !mapRef.current || hasAutoZoomedRef.current) {
      return;
    }

    const targetLocation = selectedLocationId
      ? ubicaciones.find(
          (item) => Number(item.id ?? item.id_de_la_ubicacion) === selectedLocationId
        )
      : null;

    const lat = selectedLat ?? (targetLocation ? Number(targetLocation.latitud) : INITIAL_MAP_CENTER[0]);
    const lng = selectedLng ?? (targetLocation ? Number(targetLocation.longitud ?? targetLocation.logitud) : INITIAL_MAP_CENTER[1]);
    const zoom = selectedLat != null && selectedLng != null ? 18 : 17;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    try {
      const map = mapRef.current;
      map.stop();
      map.invalidateSize(true);
      if (typeof map.flyTo === "function") {
        map.flyTo([lat, lng], zoom, { animate: true, duration: 1.2 });
      } else {
        map.setView([lat, lng], zoom, { animate: true });
      }
      hasAutoZoomedRef.current = true;
    } catch {
      // Ignorar si el mapa no está listo.
    }
  }, [mapReady, selectedLocationId, selectedLat, selectedLng, ubicaciones]);


  const handleSelectUbicacion = (ubicacion: any) => {
    setSelectedUbicacion(ubicacion);
    const ubicacionId = ubicacion.id ?? ubicacion.id_de_la_ubicacion;
    const nombre = ubicacion.nombre_ubicacion || ubicacion.nombre_de_la_ubicacion || "";
    const params = new URLSearchParams();

    if (ubicacionId != null) {
      params.set("ubicacionId", String(ubicacionId));
    }

    if (nombre) {
      params.set("ubicacionNombre", nombre);
    }

    router.push(`/muro?${params.toString()}`);
  };

  return (
    <div className="relative mx-auto max-w-md h-[900px] bg-[#eef5f3] overflow-hidden font-sans shadow-2xl rounded-[40px] border border-gray-200">
      <div className="absolute inset-0 z-0">
        <MapLeaflet
          onMapReady={handleMapReady}
          onZoomChanged={setZoomLevel}
          onLongPress={handleMapLongPress}
        >
          <Markers
            ubicaciones={ubicaciones}
            selectedLocationId={selectedLocationId}
            zoomLevel={zoomLevel}
            highlightLocationId={selectedLocationId}
            onSelectUbicacion={handleSelectUbicacion}
          />
        </MapLeaflet>
      </div>

      <div className="absolute top-12 inset-x-4 z-20 space-y-4">
        <div ref={searchWrapperRef} className="relative">
          <div className="bg-white rounded-3xl shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-gray-800 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar ubicaciones..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => {
                if (search.trim().length > 0) {
                  setShowSearchDropdown(true);
                }
              }}
              aria-label="Buscar"
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500 font-medium text-base"
            />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-400 shrink-0">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.523 2.523l2.846.813a.75.75 0 0 1 0 1.448l-2.846.813a3.75 3.75 0 0 0-2.523 2.523l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.523-2.523l-2.846-.813a.75.75 0 0 1 0-1.448l2.846-.813a3.75 3.75 0 0 0 2.523-2.523l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Zm-9 15a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 9 16.5Z" clipRule="evenodd" />
            </svg>
          </div>

          {showSearchDropdown && (
            <div className="absolute left-0 right-0 z-30 mt-2 rounded-[28px] border border-[#ECE6FF] bg-white shadow-[0_30px_70px_rgba(125,83,199,0.16)]">
              <div className="border-b border-[#F2EBFF] px-4 py-3 text-sm font-semibold text-slate-600">
                Sugerencias
              </div>
              <div className="max-h-72 overflow-y-auto">
                {searchLoading ? (
                  <div className="px-4 py-4 text-sm text-slate-500">Buscando ubicaciones...</div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-4 text-sm text-slate-500">No hay coincidencias.</div>
                ) : (
                  <ul className="divide-y divide-[#F2EBFF]">
                    {searchResults.map((ubicacion) => (
                      <li key={ubicacion.id}>
                        <button
                          type="button"
                          onClick={() => handleSelectSearchLocation(ubicacion)}
                          className="w-full px-4 py-3 text-left text-sm text-slate-900 transition hover:bg-[#F6F0FF]"
                        >
                          {ubicacion.nombre_ubicacion}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-32 right-5 z-20 flex flex-col gap-3 pointer-events-auto">
        <button
          aria-label="Centrar ubicación"
          onClick={handleCenterOnUser}
          className="w-14 h-14 bg-white rounded-2xl shadow-[0_5px_15px_rgba(0,0,0,0.1)] flex items-center justify-center text-gray-800 hover:bg-gray-50 active:scale-95 active:bg-cyan-50 transition-all duration-200 ease-out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </button>
      </div>

      {isPinModalOpen && pendingPinLocation ? (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Crear pin temporal</h2>
            <p className="mt-2 text-sm text-slate-600">
              Coordenadas: {pendingPinLocation.lat.toFixed(6)}, {pendingPinLocation.lng.toFixed(6)}
            </p>
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Nombre
                <input
                  value={pinName}
                  onChange={(e) => setPinName(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Ej. Evento temporal"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Descripción
                <textarea
                  value={pinDescription}
                  onChange={(e) => setPinDescription(e.target.value)}
                  className="mt-2 w-full min-h-[96px] rounded-3xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Opcional"
                />
              </label>
              {pinError ? (
                <p className="text-sm text-red-600">{pinError}</p>
              ) : null}
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsPinModalOpen(false);
                  setPendingPinLocation(null);
                  setPinError("");
                }}
                className="rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateTemporaryPin}
                className="rounded-3xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-amber-400"
              >
                Guardar pin temporal
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-30 px-8 pt-4 pb-8 flex justify-between items-center">
        <button aria-label="Capas" className="flex flex-col items-center gap-1.5 w-16">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-cyan-400">
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          <span className="text-[11px] font-bold text-cyan-500 tracking-wide">Mapa</span>
        </button>

        <button aria-label="Favoritos" className="flex flex-col items-center gap-1.5 w-16 group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-gray-400 group-hover:text-gray-600 transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          <span className="text-[11px] font-medium text-gray-500 group-hover:text-gray-700 transition-colors tracking-wide">Favoritos</span>
        </button>

        <button aria-label="Perfil" className="flex flex-col items-center gap-1.5 w-16 group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 text-gray-400 group-hover:text-gray-600 transition-colors">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span className="text-[11px] font-medium text-gray-500 group-hover:text-gray-700 transition-colors tracking-wide">Perfil</span>
        </button>
      </div>
    </div>
  );
}
