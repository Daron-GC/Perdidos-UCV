"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const SimpleMap = dynamic(() => import("@/components/campus/SimpleMap"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Cargando mapa...</div>,
});

export default function Desarrollo() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/");
      else setUser(data.user);
    });
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (!user) return <div className="p-4">Verificando sesión...</div>;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* CAPA 1: Mapa de fondo (más abajo de todo) */}
      <div className="absolute inset-0 z-0">
        <SimpleMap />
      </div>

      {/* CAPA 2: Header superior fijo (sobre el mapa) */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-md z-10 px-5 py-3 flex justify-between items-center">
        <div className="flex gap-4">
          <span className="font-bold text-[#A158FF] text-lg">¿Qué buscás hoy?</span>
          <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">📘 Tutorial</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full"
        >
          Cerrar sesión
        </button>
      </div>

      {/* CAPA 3: Barra inferior fija con botones (sobre el mapa) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-10">
        <div className="flex justify-around items-center py-3">
          <button className="flex flex-col items-center text-purple-600">
            <span className="text-2xl">🗺️</span>
            <span className="text-xs mt-1">Mapa</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <span className="text-2xl">❤️</span>
            <span className="text-xs mt-1">Favoritos</span>
          </button>
          <button className="flex flex-col items-center text-gray-500">
            <span className="text-2xl">👤</span>
            <span className="text-xs mt-1">Perfil</span>
          </button>
        </div>
        {/* Barra blanca (home indicator) */}
        <div className="w-32 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
      </div>
    </div>
  );
}