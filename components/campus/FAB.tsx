"use client";

import { usePathname, useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

export default function FAB() {
  const pathname = usePathname();
  const router = useRouter();
  const handleClick = () => router.push("/mapa");

  const showFab = false;

  if (!showFab) return null;

  return (
    <button
      onClick={handleClick}
      aria-label="Ir al mapa"
      className="fab pop-in"
      tabIndex={-1}
    >
      <MapPin size={28} />
    </button>
  );
}
