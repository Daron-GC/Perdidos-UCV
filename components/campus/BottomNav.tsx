"use client";

import { usePathname, useRouter } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNav = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-30">
      <button onClick={() => handleNav("/mapa")} className={`flex flex-col items-center p-2 ${isActive("/mapa") ? "text-[#A158FF]" : "text-gray-500"}`}>
        <span className="text-xl">🗺️</span>
        <span className="text-xs">Mapa</span>
      </button>
      <button onClick={() => handleNav("/favoritos")} className={`flex flex-col items-center p-2 ${isActive("/favoritos") ? "text-[#A158FF]" : "text-gray-500"}`}>
        <span className="text-xl">❤️</span>
        <span className="text-xs">Favoritos</span>
      </button>
<button 
  onClick={() => {
    console.log("BOTÓN CLICKEADO");
    alert("Si ves esto, el clic funciona");
    window.location.href = "/perfil";
  }} 
  className="flex flex-col items-center p-2"
>
  <span className="text-xl">👤</span>
  <span className="text-xs">Perfil</span>
</button>
    </div>
  );
}
