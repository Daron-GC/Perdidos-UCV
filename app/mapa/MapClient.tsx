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

const HUNT_STORAGE_KEY = "ucv_hunt_progress";
const HUNT_CLUES = [
  {
    title: "El Guardián del Tiempo",
    hint: "Tengo tres caras pero no tengo ojos, marco el paso de las horas en la Plaza del Rectorado. ¿Qué soy?",
    keywords: ["reloj", "rectorado"],
    fact: "El Reloj Universitario de la UCV es una estructura icónica de 25 metros diseñada por Carlos Raúl Villanueva."
  },
  {
    title: "El Jardín Silencioso",
    hint: "Es el jardín central de la universidad, no pertenece a ninguna facultad, pero es el corazón del descanso y el debate. ¿Cómo me llaman?",
    keywords: ["tierra", "nadie"],
    fact: "Tierra de Nadie es el área verde central de la UCV, un punto de encuentro entre estudiantes y profesores."
  },
  {
    title: "Nubes del Calder",
    hint: "Soy una gran estructura con nubes flotantes que adornan el techo de una gran sala de conciertos. ¿Dónde estoy?",
    keywords: ["aula magna", "calder", "nubes"],
    fact: "Las Nubes Flotantes del Aula Magna fueron diseñadas por Alexander Calder para mejorar la acústica teatral."
  },
  {
    title: "El Espiral Helicoidal",
    hint: "Una obra maestra de la arquitectura moderna conocida por su gran rampa helicoidal interna. ¿Qué facultad soy?",
    keywords: ["arquitectura"],
    fact: "La Facultad de Arquitectura destaca por su espectacular rampa interna de espiral que conecta todos los pisos."
  },
  {
    title: "El Mural de Léger",
    hint: "Tengo un gran vitral colorido y un mural exterior enorme creado por Fernand Léger, guardo miles de libros e historias. ¿Quién soy?",
    keywords: ["biblioteca central", "biblioteca"],
    fact: "La Biblioteca Central de la UCV es famosa por sus murales exteriores e interiores de Fernand Léger."
  },
];

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

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
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [huntProgress, setHuntProgress] = useState<number[]>([]);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [celebrationInfo, setCelebrationInfo] = useState<{ clueTitle: string; nextClue?: string | null } | null>(null);
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

  const isHuntMode = searchParams.get("hunt") === "true";
  const activeClueIndex = isHuntMode ? huntProgress.length : null;
  const activeClue = activeClueIndex != null && activeClueIndex < HUNT_CLUES.length ? HUNT_CLUES[activeClueIndex] : null;
  const huntCompleted = isHuntMode && huntProgress.length >= HUNT_CLUES.length;

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(HUNT_STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const normalized = parsed.filter(
          (value) => typeof value === "number" && Number.isInteger(value) && value >= 0 && value < HUNT_CLUES.length
        );
        setHuntProgress(normalized);
      }
    } catch {
      // Ignorar si no hay progreso guardado.
    }
  }, []);

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


  const matchesHuntClue = useCallback((ubicacion: any, clueIndex: number) => {
    if (clueIndex == null) return false;

    const source = `${ubicacion?.nombre_ubicacion || ""} ${ubicacion?.nombre_de_la_ubicacion || ""} ${ubicacion?.descripcion || ""}`;
    const normalized = normalizeText(source);
    const clue = HUNT_CLUES[clueIndex];

    return clue?.keywords.some((keyword) => normalized.includes(keyword)) ?? false;
  }, []);

  const handleSelectUbicacion = (ubicacion: any) => {
    setSelectedUbicacion(ubicacion);

    const ubicacionId = ubicacion.id ?? ubicacion.id_de_la_ubicacion;
    const nombre = ubicacion.nombre_ubicacion || ubicacion.nombre_de_la_ubicacion || "";

    if (isHuntMode && activeClueIndex != null && activeClueIndex < HUNT_CLUES.length && matchesHuntClue(ubicacion, activeClueIndex)) {
      const nextProgress = huntProgress.includes(activeClueIndex) ? huntProgress : [...huntProgress, activeClueIndex];
      setHuntProgress(nextProgress);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(HUNT_STORAGE_KEY, JSON.stringify(nextProgress));
      }

      setCelebrationInfo({
        clueTitle: HUNT_CLUES[activeClueIndex].title,
        nextClue: nextProgress.length < HUNT_CLUES.length ? HUNT_CLUES[nextProgress.length].title : null,
      });
      setShowCelebrationModal(true);
      return;
    }

    const params = new URLSearchParams();

    if (ubicacionId != null) {
      params.set("ubicacionId", String(ubicacionId));
    }

    if (nombre) {
      params.set("ubicacionNombre", nombre);
    }

    router.push(`/muro?${params.toString()}`);
  };

  const selectedVisibleLocationId = selectedUbicacion?.id ?? selectedUbicacion?.id_de_la_ubicacion ?? selectedLocationId;

  const visibleUbicaciones = useMemo(() => {
    if (selectedCategory == null) return ubicaciones;

    return ubicaciones.filter((u) => {
      const ubicacionId = Number(u.id ?? u.id_de_la_ubicacion);
      const isSelected = selectedVisibleLocationId != null && ubicacionId === Number(selectedVisibleLocationId);
      const matchesCategory = Number(u.categoria) === Number(selectedCategory);
      return matchesCategory || isSelected;
    });
  }, [ubicaciones, selectedCategory, selectedVisibleLocationId]);

  // Compute category counts and info for the categories panel
  const categoryCounts = ubicaciones.reduce<Record<number, number>>((acc, item) => {
    const key = Number(item.categoria ?? 0);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const categoryInfo: Record<number, { label: string; gradient: string; count: number }> = {
    5: { label: "Eventos", gradient: "linear-gradient(90deg,#FBBF24,#F59E0B)", count: categoryCounts[5] || 0 },
    4: { label: "Lugares", gradient: "linear-gradient(90deg,#00BBF9,#00A3E0)", count: categoryCounts[4] || 0 },
    3: { label: "Cafeterías", gradient: "linear-gradient(90deg,#ADEBB3,#7ED39B)", count: categoryCounts[3] || 0 },
    2: { label: "Esculturas", gradient: "linear-gradient(90deg,#F8F9FA,#D9D9DB)", count: categoryCounts[2] || 0 },
    1: { label: "Facultades", gradient: "linear-gradient(90deg,#A855F7,#EC4899)", count: categoryCounts[1] || 0 },
  };

  return (
    <div className="relative mx-auto max-w-md min-h-[900px] overflow-hidden font-sans rounded-[40px] border border-white/70 shadow-[0_32px_90px_rgba(83,97,255,0.13)] bg-white/90 app-bg">
      <style jsx global>{`
        @keyframes confettiRise {
          0% { transform: translateY(10px) scale(0.9); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-140px) scale(1.05); opacity: 0; }
        }
      `}</style>
      <div className="absolute inset-0 z-0 rounded-[40px] overflow-hidden">
        <MapLeaflet
          onMapReady={handleMapReady}
          onZoomChanged={setZoomLevel}
          onLongPress={handleMapLongPress}
        >
          <Markers
            ubicaciones={visibleUbicaciones}
            selectedLocationId={selectedLocationId}
            zoomLevel={zoomLevel}
            highlightLocationId={selectedLocationId}
            onSelectUbicacion={handleSelectUbicacion}
          />
        </MapLeaflet>
      </div>

      <div className="absolute top-4 inset-x-4 z-20 space-y-3">
        {isHuntMode && activeClue ? (
          <div className="hunt-banner rounded-[28px] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#A158FF]">Búsqueda del tesoro</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  Pista {activeClueIndex! + 1}/5: {activeClue.title}
                </p>
                <p className="mt-1 text-xs text-slate-600">{activeClue.hint}</p>
              </div>
              <div className="rounded-full bg-[#A158FF]/10 px-3 py-2 text-sm font-semibold text-[#A158FF]">
                {huntProgress.length}/{HUNT_CLUES.length}
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-[#A158FF] to-[#22C55E]"
                style={{ width: `${(huntProgress.length / HUNT_CLUES.length) * 100}%` }}
              />
            </div>
          </div>
        ) : null}

        <div ref={searchWrapperRef} className="relative">
          <div className="glass-panel rounded-[30px] px-4 py-4 flex items-center gap-3 border border-white/80 shadow-[0_30px_70px_rgba(125,83,199,0.16)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-purple-600 shadow-[0_10px_24px_rgba(139,92,246,0.14)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-[#7D53C7]">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
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
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 font-semibold text-base"
            />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F8F7FF] text-[#7D53C7] shadow-[0_10px_24px_rgba(116,221,208,0.14)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.523 2.523l2.846.813a.75.75 0 0 1 0 1.448l-2.846.813a3.75 3.75 0 0 0-2.523 2.523l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.523-2.523l-2.846-.813a.75.75 0 0 1 0-1.448l2.846-.813a3.75 3.75 0 0 0 2.523-2.523l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Zm-9 15a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 9 16.5Z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {showSearchDropdown && (
            <div className="absolute left-0 right-0 z-30 mt-3 rounded-[32px] border border-[#E8E3FF] bg-white shadow-[0_30px_70px_rgba(125,83,199,0.16)]">
              <div className="border-b border-[#F2EBFF] px-4 py-3 text-sm font-semibold text-slate-600 section-headline">
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

      {!showCategories && (
        <div className="absolute bottom-28 right-5 z-20 flex flex-col gap-3 pointer-events-auto">
          <button
            aria-label="Categorías"
            onClick={() => setShowCategories(true)}
            className="button-glow button-pulse group relative w-14 h-14 rounded-[26px] bg-gradient-to-br from-[#F8F4FF] via-[#EDE6FF] to-[#DCF6FF] text-[#5B21B6] shadow-[0_22px_50px_rgba(116,221,208,0.2)] flex items-center justify-center overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-gradient-to-br hover:from-[#EFE9FF] hover:via-[#E4E0FF] hover:to-[#C4F1FF] active:scale-95"
          >
            <span className="absolute inset-0 rounded-[26px] bg-[radial-gradient(circle_at_top_left,_rgba(116,221,208,0.28),_transparent_40%)] opacity-0 transition duration-300 group-hover:opacity-100" />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="relative w-6 h-6 transition-transform duration-300 ease-out group-hover:rotate-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </button>
        </div>
      )}

      {showCategories && (
        <div className="absolute inset-0 z-50 flex items-center justify-end bg-black/40 p-4">
          <div className="w-full max-w-[18rem] rounded-[32px] bg-white shadow-2xl border border-violet-100 overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-violet-100 px-4 py-3">
              <span className="text-sm font-semibold text-slate-900">Filtrar categorías</span>
              <button
                type="button"
                aria-label="Cerrar panel de categorías"
                onClick={() => setShowCategories(false)}
                className="w-10 h-10 rounded-full bg-violet-700 text-white flex items-center justify-center shadow-[0_0_24px_rgba(75,195,165,0.25)] hover:shadow-[0_0_32px_rgba(75,195,165,0.35)] transition duration-200 active:scale-95"
                style={{ boxShadow: '0 0 24px rgba(75,195,165,0.25)' }}
              >
                ×
              </button>
            </div>
            <div className="space-y-3 p-4">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setShowCategories(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-[24px] font-semibold transition ${selectedCategory === null ? 'bg-violet-50 text-violet-700 shadow-[0_10px_24px_rgba(168,85,247,0.16)] border border-violet-100' : 'text-slate-700 hover:bg-violet-50 hover:text-violet-700 hover:shadow-[0_8px_20px_rgba(168,85,247,0.08)]'}`}
              >
                Todos ({ubicaciones.length})
              </button>
              {Object.entries(categoryInfo)
                .map(([key, info]) => ({ key: Number(key), info }))
                .sort((a, b) => a.key - b.key)
                .map(({ key, info }) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedCategory((c) => (c === key ? null : key));
                      setShowCategories(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[24px] transition ${selectedCategory === key ? 'bg-violet-50 text-violet-700 shadow-[0_10px_24px_rgba(168,85,247,0.16)] border border-violet-100' : 'text-slate-700 hover:bg-violet-50 hover:text-violet-700 hover:shadow-[0_8px_20px_rgba(168,85,247,0.08)]'}`}
                  >
                    <span style={{ width: 14, height: 14, borderRadius: 6, background: info.gradient }} />
                    <span className="flex-1 text-sm font-medium">{info.label} ({info.count})</span>
                    <span className="text-xs text-gray-400">#{key}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}


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

      {showCelebrationModal && celebrationInfo ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-sm rounded-[32px] border border-white/80 bg-white p-6 shadow-2xl">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-x-0 top-0 flex justify-center gap-2">
                {Array.from({ length: 8 }).map((_, index) => (
                  <span
                    key={index}
                    className="h-3 w-2 rounded-full bg-[#A158FF]"
                    style={{ animation: `confettiRise ${1.4 + index * 0.08}s ease-out infinite`, animationDelay: `${index * 0.08}s` }}
                  />
                ))}
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#A158FF] to-[#22C55E] text-3xl text-white shadow-lg">
                ✨
              </div>
            </div>
            <h2 className="mt-5 text-center text-2xl font-black text-slate-900">¡Lo lograste!</h2>
            <p className="mt-2 text-center text-sm text-slate-600">
              Descubriste la pista de <span className="font-semibold text-[#A158FF]">{celebrationInfo.clueTitle}</span>.
            </p>
            <p className="mt-3 rounded-[20px] bg-amber-50 px-3 py-3 text-center text-sm text-slate-700">
              {activeClue?.fact ?? "Cada lugar guarda una historia que vale la pena descubrir."}
            </p>
            <p className="mt-2 text-center text-sm text-slate-600">
              {celebrationInfo.nextClue
                ? `Siguiente pista: ${celebrationInfo.nextClue}`
                : "¡Completaste las 5 pistas del tesoro!"}
            </p>
            <button
              type="button"
              onClick={() => {
                setShowCelebrationModal(false);
                setCelebrationInfo(null);
              }}
              className="mt-6 w-full rounded-[22px] bg-[#A158FF] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#7D53C7]"
            >
              Seguir explorando
            </button>
          </div>
        </div>
      ) : null}

      {/* Bottom nav removed per user request */}
    </div>
  );
}
