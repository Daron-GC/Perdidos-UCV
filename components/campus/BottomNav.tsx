"use client";

import { usePathname, useRouter } from "next/navigation";
import { Map, Heart, User } from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // ocultar en login (/) y register
  // ocultar en login (/) y register
  if (pathname === "/" || pathname?.startsWith("/register")) return null;

  const handleNav = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around items-center py-3 z-50 comic-font">
      <button onClick={() => handleNav("/desarrollo")} className={`flex flex-col items-center p-2 pop ${isActive("/desarrollo") ? "text-[#7D53C7] nav-active" : "text-gray-500"}`}>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#A158FF] to-[#7D53C7] text-white comic-shadow">
          <Map size={20} />
        </div>
        <span className="text-xs mt-1">Mapa</span>
      </button>
      <button onClick={() => handleNav("/favoritos")} className={`flex flex-col items-center p-2 pop ${isActive("/favoritos") ? "text-[#7D53C7] nav-active" : "text-gray-500"}`}>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FF8AB3] to-[#FFB86B] text-white comic-shadow">
          <Heart size={20} />
        </div>
        <span className="text-xs mt-1">Favoritos</span>
      </button>
      <button onClick={() => handleNav("/perfil")} className={`flex flex-col items-center p-2 pop ${isActive("/perfil") ? "text-[#7D53C7] nav-active" : "text-gray-500"}`}>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#74DDD0] to-[#4BC3A5] text-white comic-shadow">
          <User size={20} />
        </div>
        <span className="text-xs mt-1">Perfil</span>
      </button>
    </div>
  );
}
