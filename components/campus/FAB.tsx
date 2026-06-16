"use client";

import { usePathname, useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

export default function FAB() {
  const pathname = usePathname();
  const router = useRouter();
  const handleClick = () => router.push("/desarrollo");

  const showFab = pathname === "/desarrollo" || pathname?.startsWith("/desarrollo") || pathname === "/mapa" || pathname?.startsWith("/mapa");

  if (!showFab) return null;

  return (
    <button onClick={handleClick} aria-label="Ir al mapa" className="fab pop-in">
      <MapPin size={28} />
    </button>
  );
}
