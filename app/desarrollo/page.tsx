"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import SearchModal from "@/components/campus/SearchModal"; // ← lo crearemos ahora
import { BookOpen } from "lucide-react";

const MainMap = dynamic(() => import("@/componentes/MainMap"), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Cargando mapa...</div>,
});

export default function Desarrollo() {
  const [user, setUser] = useState<any>(null);
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

  if (!user) return <div className="flex items-center justify-center h-full">Verificando sesión...</div>;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Mapa de fondo */}
      <div className="absolute inset-0 z-0">
        <MainMap user={user} />
      </div>

      {/* Header superior */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 w-[92%] max-w-3xl">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-md px-4 py-3 flex items-center justify-between comic-font">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSearchOpen(true)} className="text-[#7D53C7] font-bold text-lg hover:underline">
              ¿Qué buscás hoy?
            </button>
            <div className="ml-2" />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/ayuda')} aria-label="Tutorial" className="icon-btn">
              <BookOpen size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      {/* Barra inferior: provista por layout global */}

      {/* Modal de búsqueda (solo se ve si isSearchOpen es true) */}
      {isSearchOpen && (
        <SearchModal onClose={() => setIsSearchOpen(false)} />
      )}
    </div>
  );
}