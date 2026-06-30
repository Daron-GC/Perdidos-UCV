"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getUserProfile } from "./actions";
import LoadingOverlay from "@/components/LoadingOverlay";
import {
  Star,
  Heart,
  MapPin,
  Settings,
  MessageSquare,
  Bell,
  HelpCircle,
  FileText,
  Map,
  User,
  PenSquare,
  Trophy,
} from "lucide-react";

const HUNT_STORAGE_KEY = "ucv_hunt_progress";
const LOCAL_ROL_KEY = "ucv_user_rol";
const HUNT_CLUES = [
  { title: "Reloj del rectorado", hint: "Busca un lugar que recuerde al reloj y al rectorado." },
  { title: "Tierra de nadie", hint: "Encuentra el punto que conecta historias y leyendas del campus." },
  { title: "Aula Magna / Calder", hint: "Sigue la pista de las nubes y el espacio más emblemático." },
  { title: "Arquitectura", hint: "Visita el rincón que representa la esencia arquitectónica del campus." },
  { title: "Biblioteca", hint: "Llega al corazón del conocimiento universitario." },
];


export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const [rating, setRating] = useState<number | null>(0.0);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [subtitle, setSubtitle] = useState<string>("Estudiante UCV");
  const [showTreasureModal, setShowTreasureModal] = useState(false);
  const [treasureProgress, setTreasureProgress] = useState<number[]>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getUserProfile();
        const displayName = profile.email || profile.username || "Usuario";
        const savedRol = typeof window !== "undefined" ? window.localStorage.getItem(LOCAL_ROL_KEY) : "";
        const subtitleText = savedRol || (profile.username && profile.username !== profile.email
          ? profile.username
          : "Estudiante UCV");

        setUsername(displayName);
        setEmail(profile.email ?? null);
        setRating(profile.rating ?? 0.0);
        setCommentsCount(profile.comments_count ?? 0);
        setLikesCount(profile.likes_count ?? 0);
        setSubtitle(subtitleText);
      } catch (e) {
        setUsername("Usuario");
        setEmail(null);
        const savedRol = typeof window !== "undefined" ? window.localStorage.getItem(LOCAL_ROL_KEY) : "";
        setSubtitle(savedRol || "Estudiante UCV");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [supabase]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(HUNT_STORAGE_KEY);
      if (!stored) return;

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        const normalized = parsed.filter(
          (value) => typeof value === "number" && Number.isInteger(value) && value >= 0 && value < HUNT_CLUES.length
        );
        setTreasureProgress(normalized);
      }
    } catch {
      // Ignorar si no hay progreso guardado.
    }
  }, []);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.target.value;
    setSubtitle(nextValue);

    if (typeof window === "undefined") return;

    if (nextValue) {
      window.localStorage.setItem(LOCAL_ROL_KEY, nextValue);
    } else {
      window.localStorage.removeItem(LOCAL_ROL_KEY);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error cerrando sesión:', err);
    }
    // La página de login está en la raíz `/` (app/page.tsx), no en `/login`
    router.push("/");
  };

  const handleOpenTreasureModal = () => setShowTreasureModal(true);
  const handleCloseTreasureModal = () => setShowTreasureModal(false);
  const handleStartTreasureHunt = () => {
    handleCloseTreasureModal();
    router.push("/mapa?hunt=true");
  };
  const handleResetTreasureHunt = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(HUNT_STORAGE_KEY);
    }
    setTreasureProgress([]);
  };

  const treasureCompleted = treasureProgress.length === HUNT_CLUES.length;
  const treasurePercent = Math.round((treasureProgress.length / HUNT_CLUES.length) * 100);

  if (loading) return <LoadingOverlay message="Cargando tu perfil..." />;

  return (
    <div className="relative min-h-screen app-bg flex flex-col items-center px-4 pb-10 pt-6">
      <div className="w-full max-w-md md:max-w-2xl glass-panel shadow-[0_30px_90px_rgba(83,97,255,0.14)] rounded-[36px] mt-6 mb-24 p-6 md:p-10 flex flex-col items-center entry-card relative overflow-hidden border border-white/80">
        <img
          src="/IMG-20260531-WA0042.jpg.jpeg"
          alt="logo Perdidos UCV"
          className="logo-watermark h-[220px] w-[220px]"
        />

        {/* Avatar */}
        <div className="flex flex-col items-center pop-in stagger-1 relative z-10">
          <div className="relative">
            <ProfileAvatar />
            <div className="absolute -right-2 -top-2 rounded-2xl bg-[#A158FF] px-2 py-1 text-[10px] text-white font-bold shadow-sm">
              VIP
            </div>
          </div>

          <h2 className="text-3xl comic-font text-[#2C2D4A] mt-3 tracking-wide fade-in-up stagger-2">
            {username}
          </h2>

          {email ? (
            <p className="text-sm text-[#5F5F75] mt-1 fade-in-up stagger-3">
              {email}
            </p>
          ) : null}

          <p className="text-sm text-[#5F5F75] mt-1 flex flex-col gap-2 fade-in-up stagger-3 sm:flex-row sm:items-center">
            <span className="font-semibold text-[#2C2D4A]">{subtitle}</span>
            <span className="hidden sm:inline mx-1">•</span>
            <span className="flex items-center gap-1 text-[#7D53C7]">
              <span className="text-[#A158FF]">★</span>
              {rating !== null ? rating.toFixed(1) : '—'}
            </span>
            <span className="text-[#7B7B9E]">({commentsCount} reseñas • {likesCount} likes)</span>
          </p>

        </div>

        {/* Lista de opciones con íconos SVG */}
        <div className="w-full mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="fade-in-up stagger-1 md:col-span-2">
            <ProfileItem icon={<Star size={22} className="text-white" />} label="Mis Reseñas" path="/perfil/resenas" />
          </div>
          <div className="fade-in-up stagger-3 md:col-span-2">
            <button
              onClick={handleOpenTreasureModal}
              className="w-full flex flex-col items-center justify-center gap-2 rounded-[28px] border border-white/70 bg-gradient-to-r from-[#F59E0B] via-[#A158FF] to-[#22C55E] px-4 py-4 text-white shadow-[0_18px_45px_rgba(161,88,255,0.18)] transition hover:shadow-[0_22px_55px_rgba(161,88,255,0.23)] active:scale-[0.99]"
            >
              <div className="flex items-center justify-center rounded-full bg-white/15 p-3">
                <Trophy size={22} className="text-white" />
              </div>
              <span className="text-sm font-bold md:text-base">Búsqueda del Tesoro</span>
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                {treasureProgress.length}/{HUNT_CLUES.length} encontrados
              </span>
            </button>
          </div>
        </div>

        {/* Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-[#A158FF] hover:bg-[#7D53C7] text-white font-bold py-3 rounded-2xl shadow-lg shadow-[#7D53C7]/20 transition active:scale-[0.98]"
        >
          CERRAR SESIÓN
        </button>
      </div>

      {/* Barra inferior: ahora provista por layout global */}

      {showTreasureModal ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4">
          <div className="w-full max-w-md rounded-[32px] border border-white/80 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#A158FF]">Desafío</p>
                <h3 className="mt-1 text-2xl font-black text-[#2C2D4A]">Búsqueda del Tesoro UCV</h3>
              </div>
              <button
                type="button"
                onClick={handleCloseTreasureModal}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
              >
                ×
              </button>
            </div>

            <div className="mt-4 rounded-[24px] bg-gradient-to-r from-[#A158FF] via-[#7D53C7] to-[#22C55E] p-4 text-white">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Progreso</span>
                <span>{treasureProgress.length}/{HUNT_CLUES.length}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/30">
                <div className="h-2 rounded-full bg-white" style={{ width: `${treasurePercent}%` }} />
              </div>
              <p className="mt-3 text-sm text-white/90">
                {treasureCompleted
                  ? "¡Ya completaste todas las pistas! Tu medalla de explorador está lista."
                  : "Descubre los lugares más icónicos del campus mientras juegas."}
              </p>
            </div>

            <ul className="mt-4 space-y-2">
              {HUNT_CLUES.map((clue, index) => {
                const unlocked = treasureProgress.includes(index);
                return (
                  <li
                    key={clue.title}
                    className={`flex items-center justify-between rounded-[20px] border px-3 py-3 ${
                      unlocked ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{clue.title}</p>
                      <p className="text-xs opacity-80">{clue.hint}</p>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">
                      {unlocked ? "Listo" : "Pendiente"}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleStartTreasureHunt}
                className="flex-1 rounded-[22px] bg-[#A158FF] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#7D53C7]"
              >
                ¡Buscar en el mapa! 🗺️
              </button>
              <button
                type="button"
                onClick={handleResetTreasureHunt}
                className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Componente para cada ítem de la lista
function ProfileItem({
  icon,
  label,
  badge,
  path,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  path?: string;
  onClick?: () => void;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) return onClick();
    if (path) return router.push(path);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex flex-col items-center justify-center gap-2 py-4 px-3 rounded-3xl bg-gradient-to-r from-[#7D53C7] via-[#A158FF] to-[#74DDD0] text-white font-bold border border-transparent shadow-lg shadow-[#7D53C7]/15 transition hover:shadow-[#7D53C7]/30 active:scale-[0.99]"
    >
      <div className="flex items-center justify-center rounded-full bg-white/15 p-3">
        {icon}
      </div>
      <span className="text-sm md:text-base">{label}</span>
      {badge && (
        <span className="mt-1 bg-white/20 text-white font-bold text-xs px-3 py-1 rounded-full">{badge}</span>
      )}
    </button>
  );
}

// Barra inferior de navegación con íconos SVG
function BottomNav({ active }: { active: string }) {
  const router = useRouter();
  const navItems = [
    { id: "mapa", label: "Mapa", icon: <Map size={22} />, path: "/desarrollo" },
    { id: "favoritos", label: "Favoritos", icon: <Heart size={22} />, path: "/favoritos" },
    { id: "perfil", label: "Perfil", icon: <User size={22} />, path: "/perfil" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center px-4 py-1 transition ${
              active === item.id ? "text-purple-600" : "text-gray-500"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-0.5 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="w-32 h-1 bg-gray-300 rounded-full mx-auto mb-1.5"></div>
    </div>
  );
}

function ProfileAvatar() {
  return (
    <img
      src="/avatars/misterio.svg"
      alt="Avatar"
      className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#8CBFED]/40 shadow-[0_18px_45px_rgba(140,191,237,0.18)] object-cover avatar-comic pop-in bg-white"
    />
  );
}