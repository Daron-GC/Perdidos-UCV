"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

type UbicacionResult = {
  id: number;
  nombre_ubicacion: string;
};

export default function DashboardSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UbicacionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 350);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const supabase = useMemo(() => createClient(), []);

  const fetchUbicaciones = useCallback(
    async (searchText: string) => {
      if (!searchText) {
        setResults([]);
        setNoResults(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("ubicaciones")
        .select("id, nombre_ubicacion")
        .ilike("nombre_ubicacion", `%${searchText}%`)
        .limit(6);

      setLoading(false);

      if (error) {
        console.error("Error al buscar ubicaciones:", error);
        setResults([]);
        setNoResults(false);
        return;
      }

      const ubicaciones = (data ?? []) as UbicacionResult[];
      setResults(ubicaciones);
      setNoResults(ubicaciones.length === 0);
    },
    [supabase]
  );

  useEffect(() => {
    const searchText = debouncedQuery.trim();
    if (!searchText) {
      setResults([]);
      setNoResults(false);
      setLoading(false);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
    let active = true;

    const runSearch = async () => {
      await fetchUbicaciones(searchText);
      if (!active) return;
      setShowDropdown(true);
    };

    runSearch();

    return () => {
      active = false;
    };
  }, [debouncedQuery, fetchUbicaciones]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (event.target instanceof Node && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (ubicacionId: number, nombreUbicacion: string) => {
    setShowDropdown(false);
    const params = new URLSearchParams({
      ubicacionId: String(ubicacionId),
      ubicacionNombre: nombreUbicacion,
    });

    router.push(`/mapa?${params.toString()}`);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <div className="flex items-center gap-3 rounded-[1.75rem] border border-[#E6E0FF] bg-white/95 px-4 py-3 shadow-sm shadow-[#8161d71a] transition-colors duration-300 focus-within:border-[#A158FF] sm:px-5">
        <Search size={20} className="text-[#8B5CF6]" />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          onFocus={() => {
            if (query.trim().length > 0) {
              setShowDropdown(true);
            }
          }}
          placeholder="Buscar ubicaciones..."
          className="min-w-0 flex-1 border-0 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-[1.5rem] border border-[#E5DBFF] bg-white/95 shadow-[0_24px_60px_rgba(125,83,199,0.16)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#F1E9FF] px-4 py-3 text-sm text-slate-500">
            <span>Resultados</span>
            {loading ? (
              <span className="inline-flex items-center gap-2 text-[#7D53C7]">
                <span className="h-2.5 w-2.5 animate-spin rounded-full border border-[#7D53C7] border-t-transparent" />
                Cargando...
              </span>
            ) : (
              <span className="text-xs text-slate-400">Sugerencias rápidas</span>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {query.trim().length === 0 ? (
              <div className="px-4 py-4 text-sm text-slate-500">Escribe para ver sugerencias.</div>
            ) : loading ? (
              <div className="px-4 py-4 text-sm text-slate-500">Buscando ubicaciones...</div>
            ) : noResults ? (
              <div className="px-4 py-4 text-sm text-slate-500">No se encontraron coincidencias para &quot;{query}&quot;.</div>
            ) : (
              <ul className="divide-y divide-[#F3EBFF]">
                {results.map((ubicacion) => (
                  <li key={ubicacion.id}>
                    <button
                      type="button"
                      onClick={() => handleSelect(ubicacion.id, ubicacion.nombre_ubicacion)}
                      className="w-full px-4 py-3 text-left text-sm font-medium text-slate-900 transition-colors duration-150 hover:bg-[#F4F0FF]"
                    >
                      {ubicacion.nombre_ubicacion}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
