"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";

const lugares = [
  { id: 1, nombre: "Biblioteca Central", ubicacion: "Edificio A" },
  { id: 2, nombre: "Cafetería Norte", ubicacion: "Edificio B" },
  { id: 3, nombre: "Aula Magna", ubicacion: "Edificio C" },
  { id: 4, nombre: "Laboratorio de Física", ubicacion: "Edificio D" },
  { id: 5, nombre: "Jardín Botánico", ubicacion: "Zona Verde" },
];

export default function DashboardSearch() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const resultados = lugares.filter((lugar) =>
    lugar.nombre.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-[2rem] shadow-[0_28px_70px_rgba(125,83,199,0.12)] p-4 flex items-center gap-3">
        <div className="flex h-14 flex-1 items-center rounded-[1.75rem] border border-[#E6E0FF] bg-[#FBF8FF] px-4 text-sm text-slate-700 shadow-sm">
          <Search size={20} className="text-[#A158FF]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            placeholder="¿Qué buscas hoy?"
            className="ml-3 w-full bg-transparent outline-none placeholder:text-slate-400"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowResults(true)}
          className="inline-flex h-14 w-14 items-center justify-center rounded-[1.5rem] bg-[#7D53C7] text-white shadow-[0_18px_30px_rgba(125,83,199,0.2)] transition hover:bg-[#6c44c0]"
        >
          <MapPin size={20} />
        </button>
      </div>

      {showResults && (
        <div className="bg-white/95 border border-[#E5DBFF] rounded-[2rem] shadow-[0_18px_40px_rgba(125,83,199,0.1)] p-4">
          <p className="text-sm font-semibold text-slate-500 mb-3">Resultados de búsqueda</p>
          {query.trim().length === 0 ? (
            <p className="text-sm text-slate-500">Escribe algo para buscar lugares en el campus.</p>
          ) : resultados.length > 0 ? (
            <ul className="space-y-3">
              {resultados.map((lugar) => (
                <li key={lugar.id} className="rounded-2xl border border-[#F1E9FF] bg-[#FAF7FF] p-3 text-sm font-medium text-slate-800">
                  <div className="flex items-center justify-between gap-2">
                    <span>{lugar.nombre}</span>
                    <span className="text-xs text-[#7D53C7] font-semibold">{lugar.ubicacion}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No se encontraron resultados para "{query}".</p>
          )}
        </div>
      )}
    </div>
  );
}
