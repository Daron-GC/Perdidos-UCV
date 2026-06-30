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
    <div
      className="fixed bottom-4 left-4 right-4 mx-auto max-w-3xl bg-white/90 backdrop-blur-2xl border border-white/70 shadow-[0_24px_80px_rgba(15,23,42,0.12)] rounded-[32px] flex justify-around items-center py-3 px-4 z-50 comic-font"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
    >
      <button
        onClick={() => handleNav("/mapa")}
        className={`glow-on-hover-aqua group relative flex flex-col items-center gap-1 px-2 py-2 rounded-[26px] transition duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isActive("/mapa") ? "text-[#5B21B6]" : "text-slate-500"}`}
        aria-label="Ir al mapa"
      >
        <span className={`absolute -top-3 h-1.5 w-10 rounded-full transition ${isActive("/mapa") ? "bg-violet-500 shadow-[0_0_18px_rgba(168,85,247,0.32)]" : "bg-transparent"}`} />
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-[22px] bg-gradient-to-b from-[#8B5CF6] to-[#5B21B6] text-white shadow-[0_18px_50px_rgba(88,40,255,0.22)]">
          <Map size={20} />
        </div>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold">Mapa</span>
      </button>

      <button
        onClick={() => handleNav("/favoritos")}
        className={`glow-on-hover-aqua group relative flex flex-col items-center gap-1 px-2 py-2 rounded-[26px] transition duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isActive("/favoritos") ? "text-[#5B21B6]" : "text-slate-500"}`}
        aria-label="Ir a favoritos"
      >
        <span className={`absolute -top-3 h-1.5 w-10 rounded-full transition ${isActive("/favoritos") ? "bg-violet-500 shadow-[0_0_18px_rgba(168,85,247,0.32)]" : "bg-transparent"}`} />
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-[22px] bg-gradient-to-b from-[#A855F7] via-[#9333EA] to-[#5B21B6] text-white shadow-[0_18px_50px_rgba(168,85,247,0.22)]">
          <Heart size={20} />
        </div>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold">Favoritos</span>
      </button>

      <button
        onClick={() => handleNav("/perfil")}
        className={`glow-on-hover-aqua group relative flex flex-col items-center gap-1 px-2 py-2 rounded-[26px] transition duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isActive("/perfil") ? "text-[#5B21B6]" : "text-slate-500"}`}
        aria-label="Ir a perfil"
      >
        <span className={`absolute -top-3 h-1.5 w-10 rounded-full transition ${isActive("/perfil") ? "bg-violet-500 shadow-[0_0_18px_rgba(168,85,247,0.32)]" : "bg-transparent"}`} />
        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-[22px] bg-gradient-to-b from-[#34D399] to-[#059669] text-white shadow-[0_18px_50px_rgba(52,211,153,0.2)]">
          <User size={20} />
        </div>
        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold">Perfil</span>
      </button>
    </div>
  );
}
