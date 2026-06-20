"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
  const [search, setSearch] = useState("");
  const [ubicaciones, setUbicaciones] = useState<any[]>(FALLBACK_UBICACIONES);
  const [selectedUbicacion, setSelectedUbicacion] = useState<any | null>(null);
  const mapRef = useRef<any>(null);

  const handleCenterOnUser = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mapRef.current) return;

        mapRef.current.flyTo(
          [position.coords.latitude, position.coords.longitude],
          17,
          { duration: 1.2 }
        );
      },
      (error) => {
        console.error("Error centrándose en la ubicación:", error);
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
            "id, id_de_la_ubicacion, nombre_ubicacion, nombre_de_la_ubicacion, horarios, longitud, latitud, descripcion"
          );

        if (error) {
          setUbicaciones(FALLBACK_UBICACIONES);
          return;
        }

        const datosFormateados = (data || [])
          .map((item: any) => ({
            id: item.id ?? item.id_de_la_ubicacion,
            id_de_la_ubicacion: item.id_de_la_ubicacion ?? item.id,
            nombre_ubicacion: item.nombre_ubicacion ?? item.nombre_de_la_ubicacion,
            nombre_de_la_ubicacion:
              item.nombre_de_la_ubicacion ?? item.nombre_ubicacion,
            horarios: item.horarios,
            longitud: Number(item.longitud ?? item.logitud),
            latitud: Number(item.latitud),
            descripcion: item.descripcion,
          }))
          .filter(
            (item) =>
              Number.isFinite(item.longitud) && Number.isFinite(item.latitud)
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

  const handleSelectUbicacion = (ubicacion: any) => {
    setSelectedUbicacion(ubicacion);
    const ubicacionId = ubicacion.id ?? ubicacion.id_de_la_ubicacion;
    const nombre = encodeURIComponent(
      ubicacion.nombre_ubicacion || ubicacion.nombre_de_la_ubicacion || ""
    );
    router.push(
      `/muro?ubicacionId=${ubicacionId}${nombre ? `&ubicacionNombre=${nombre}` : ""}`
    );
  };

  return (
    <div className="relative mx-auto max-w-md h-[900px] bg-[#eef5f3] overflow-hidden font-sans shadow-2xl rounded-[40px] border border-gray-200">
      <div className="absolute inset-0 z-0">
        <MapLeaflet
          onMapReady={(map) => {
            mapRef.current = map;
          }}
        >
          <Markers
            ubicaciones={ubicaciones}
            onSelectUbicacion={handleSelectUbicacion}
          />
        </MapLeaflet>
      </div>

      <div className="absolute top-12 inset-x-4 z-20 space-y-4">
        <div className="bg-white rounded-3xl shadow-lg px-4 py-3 flex items-center gap-3 border border-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-gray-800 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="¿Qué buscas hoy?"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            aria-label="Buscar"
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500 font-medium text-base"
          />
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-purple-400 shrink-0">
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.523 2.523l2.846.813a.75.75 0 0 1 0 1.448l-2.846.813a3.75 3.75 0 0 0-2.523 2.523l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.523-2.523l-2.846-.813a.75.75 0 0 1 0-1.448l2.846-.813a3.75 3.75 0 0 0 2.523-2.523l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Zm-9 15a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 9 16.5Z" clipRule="evenodd" />
          </svg>
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
