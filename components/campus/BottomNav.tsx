"use client";

import { useState } from "react";

export default function BottomNav() {
  const [active, setActive] = useState("mapa");

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-30">
      <button
        onClick={() => setActive("mapa")}
        className={`flex flex-col items-center p-2 ${active === "mapa" ? "text-[#A158FF]" : "text-gray-500"}`}
      >
        <span className="text-xl">🗺️</span>
        <span className="text-xs">Mapa</span>
      </button>
      <button
        onClick={() => setActive("favoritos")}
        className={`flex flex-col items-center p-2 ${active === "favoritos" ? "text-[#A158FF]" : "text-gray-500"}`}
      >
        <span className="text-xl">❤️</span>
        <span className="text-xs">Favoritos</span>
      </button>
      <button
        onClick={() => setActive("perfil")}
        className={`flex flex-col items-center p-2 ${active === "perfil" ? "text-[#A158FF]" : "text-gray-500"}`}
      >
        <span className="text-xl">👤</span>
        <span className="text-xs">Perfil</span>
      </button>
    </div>
  );
}