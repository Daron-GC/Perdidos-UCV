"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type FavoriteLocation = {
  id?: number;
  ubicacionId: number;
  nombre: string;
  descripcion?: string | null;
  latitud?: number | null;
  longitud?: number | null;
};

const FAVORITES_STORAGE_KEY = "perdidos_ucv_favoritos";

const loadFavoritesFromStorage = () => {
  if (typeof window === "undefined") return [] as FavoriteLocation[];

  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) return [] as FavoriteLocation[];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && typeof item.ubicacionId === "number")
      : [];
  } catch {
    return [] as FavoriteLocation[];
  }
};

const saveFavoritesToStorage = (favorites: FavoriteLocation[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
};

function FavoriteBadgeIcon({ className }: { className?: string }) {
  return (
    <span className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
      </svg>
    </span>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <span className={className}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10Z" />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
    </span>
  );
}

export default function FavoritosPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const localFavorites = loadFavoritesFromStorage();
    setFavorites(localFavorites);
    setLoading(false);
  }, []);

  const handleRemoveFavorite = (ubicacionId: number) => {
    const nextFavorites = favorites.filter((item) => item.ubicacionId !== ubicacionId);
    setFavorites(nextFavorites);
    saveFavoritesToStorage(nextFavorites);
  };

  const handleOpenMapa = (favorite: FavoriteLocation) => {
    const params = new URLSearchParams();
    params.set("ubicacionId", String(favorite.ubicacionId));
    if (favorite.nombre) {
      params.set("ubicacionNombre", favorite.nombre);
    }
    if (favorite.latitud != null && favorite.longitud != null) {
      params.set("latitud", String(favorite.latitud));
      params.set("longitud", String(favorite.longitud));
    }
    router.push(`/mapa?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FD] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <section className="mb-10 overflow-hidden rounded-[32px] border border-[#EDE9FE] bg-gradient-to-r from-[#A158FF] via-[#7D53C7] to-[#74DDD0] p-8 shadow-[0_30px_80px_rgba(125,83,199,0.16)] text-white">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/95">
                <FavoriteBadgeIcon className="text-white" />
                Guardados
              </div>
              <div>
                <h1 className="text-4xl font-semibold tracking-tight">Favoritos</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90">
                  Tus lugares preferidos guardados localmente. Abre cualquiera en el mapa con un solo toque.
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-white/30 bg-white/10 px-5 py-4 text-right backdrop-blur-sm">
              <p className="text-sm uppercase tracking-[0.18em] text-white/80">Total</p>
              <p className="mt-2 text-3xl font-semibold">{favorites.length}</p>
            </div>
          </div>
        </section>

        <div className="space-y-5">
          {loading ? (
            <div className="rounded-[32px] border border-dashed border-[#00BBF9]/40 bg-white/90 px-6 py-14 text-center text-slate-500 shadow-sm">
              Cargando tus favoritos...
            </div>
          ) : error ? (
            <div className="rounded-[32px] border border-red-200 bg-red-50 px-6 py-14 text-center text-red-700 shadow-sm">
              {error}
            </div>
          ) : favorites.length === 0 ? (
            <div className="rounded-[32px] border border-[#A158FF]/30 bg-white px-6 py-14 text-center text-slate-600 shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#A158FF]/20 text-[#7D53C7]">
                <FavoriteBadgeIcon className="text-[#7D53C7]" />
              </div>
              <p className="mt-4 text-lg font-semibold">No hay favoritos aún</p>
              <p className="mt-2 max-w-xl mx-auto text-sm text-slate-500">
                Agrega un lugar desde el mapa para verlo aquí y acceder rápidamente.
              </p>
            </div>
          ) : (
            favorites.map((favorite) => (
              <article
                key={favorite.ubicacionId}
                className="group overflow-hidden rounded-[32px] border border-[#E3F9FF] bg-white shadow-[0_24px_45px_rgba(83,102,255,0.08)] transition hover:-translate-y-1 hover:shadow-[0_30px_65px_rgba(83,102,255,0.14)]"
              >
                <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#F4F0FF] px-3 py-1 text-[#7D53C7]">
                        <MapPinIcon className="text-[#7D53C7]" />
                        Ubicación {favorite.ubicacionId}
                      </span>
                      <span className="rounded-full bg-[#F3F0FF] px-3 py-1 text-[#A158FF]">
                        Guardado
                      </span>
                    </div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {favorite.nombre}
                    </h2>
                    <p className="max-w-2xl text-sm leading-6 text-slate-600">
                      {favorite.descripcion || "Sin descripción disponible."}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:items-end">
                    <button
                      type="button"
                      onClick={() => handleOpenMapa(favorite)}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#A158FF] via-[#7D53C7] to-[#74DDD0] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#7D53C7]/20 transition hover:opacity-95"
                    >
                      <MapPinIcon className="text-white" />
                      Localizar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFavorite(favorite.ubicacionId)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-[#A158FF]/20 bg-white px-5 py-3 text-sm font-semibold text-[#7D53C7] transition hover:border-[#7D53C7]/30 hover:bg-[#F4F0FF]"
                    >
                      <FavoriteBadgeIcon className="text-[#A158FF]" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
