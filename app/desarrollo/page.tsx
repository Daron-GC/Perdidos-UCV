"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import SearchModal from "@/components/campus/SearchModal"; // ← lo crearemos ahora

const SimpleMap = dynamic(() => import("@/componentes/Mapleaflet"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Cargando mapa...</div>,
});

export default function Desarrollo() {
  const [user, setUser] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  const goToMapa = () => router.push("/mapa");
  const goToFavoritos = () => router.push("/favoritos");
  const goToPerfil = () => router.push("/perfil");

  if (!user) return <div className="p-4">Verificando sesión...</div>;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Mapa de fondo */}
      <div className="absolute inset-0 z-0">
        <SimpleMap />
      </div>

      {/* Header superior */}
      <div className="absolute top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-md z-10 px-5 py-3 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          {/* Título clickeable que abre el modal */}
          <span 
            onClick={() => setIsSearchOpen(true)} 
            className="font-bold text-[#A158FF] text-lg cursor-pointer hover:underline"
          >
            ¿Qué buscás hoy?
          </span>
          <span className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">📘 Tutorial</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Barra inferior con navegación */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-10">
        <div className="flex justify-around items-center py-3">
          <button onClick={goToMapa} className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-2xl">🗺️</span>
            <span className="text-xs mt-1">Mapa</span>
          </button>
          <button onClick={goToFavoritos} className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-2xl">❤️</span>
            <span className="text-xs mt-1">Favoritos</span>
          </button>
          <button onClick={goToPerfil} className="flex flex-col items-center text-gray-500 hover:text-purple-600 transition">
            <span className="text-2xl">👤</span>
            <span className="text-xs mt-1">Perfil</span>
          </button>
        </div>
        <div className="w-32 h-1 bg-gray-300 rounded-full mx-auto mb-2"></div>
      </div>

      {/* Modal de búsqueda (solo se ve si isSearchOpen es true) */}
      {isSearchOpen && (
        <SearchModal onClose={() => setIsSearchOpen(false)} />
      )}
    </div>
  );
}