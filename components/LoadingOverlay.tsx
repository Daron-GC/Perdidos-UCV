"use client";

import Image from "next/image";

export default function LoadingOverlay({
  message = "Cargando tu experiencia...",
}: {
  message?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-[#E9E2FF] bg-white p-8 shadow-[0_24px_80px_rgba(125,83,199,0.16)]">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#F4EEFF] shadow-inner shadow-[#D8B8FF]/40">
          <Image
            src="/IMG-20260531-WA0042.jpg.jpeg"
            alt="Perdidos UCV"
            width={76}
            height={76}
            className="rounded-full"
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-[#7D53C7]">Perdidos UCV</h1>
          <p className="mt-2 text-sm text-slate-500">{message}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#A158FF] animate-pulse"></span>
          <span className="h-2 w-2 rounded-full bg-[#74DDD0] animate-pulse delay-150"></span>
          <span className="h-2 w-2 rounded-full bg-[#FF8AB3] animate-pulse delay-300"></span>
        </div>
      </div>
    </div>
  );
}
