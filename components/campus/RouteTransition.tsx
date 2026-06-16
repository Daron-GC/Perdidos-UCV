"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteTransition() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousPath, setPreviousPath] = useState(pathname);

  useEffect(() => {
    if (pathname === previousPath) return;

    setIsTransitioning(true);
    setPreviousPath(pathname);

    const timer = window.setTimeout(() => {
      setIsTransitioning(false);
    }, 450);

    return () => window.clearTimeout(timer);
  }, [pathname, previousPath]);

  if (!isTransitioning) return null;

  return (
    <div className="transition-overlay">
      <div className="transition-card animate-slide-up">
        <div className="transition-avatar">
          <Image
            src="/IMG-20260531-WA0042.jpg.jpeg"
            alt="Perdidos UCV"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
        <div className="text-center">
          <p className="text-base font-bold text-[#7D53C7]">Perdidos UCV</p>
          <p className="text-sm text-slate-500 mt-1">Cargando tu siguiente pantalla...</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="transition-dot bg-[#A158FF]" />
          <span className="transition-dot bg-[#74DDD0] delay-150" />
          <span className="transition-dot bg-[#FF8AB3] delay-300" />
        </div>
      </div>
    </div>
  );
}
