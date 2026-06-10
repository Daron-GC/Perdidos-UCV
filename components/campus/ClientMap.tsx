"use client";

import dynamic from "next/dynamic";

const CampusMap = dynamic(() => import("@/components/campus/CampusMap"), {
  ssr: false,
  loading: () => <p className="p-4 text-center">Cargando mapa...</p>,
});

export default function ClientMap() {
  return <CampusMap />;
}