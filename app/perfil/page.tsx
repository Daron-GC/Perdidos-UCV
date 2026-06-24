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
} from "lucide-react";

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

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getUserProfile();
        const displayName = profile.email || profile.username || "Usuario";
        const subtitleText = profile.username && profile.username !== profile.email
          ? profile.username
          : "Estudiante UCV";

        setUsername(displayName);
        setEmail(profile.email ?? null);
        setRating(profile.rating ?? 0.0);
        setCommentsCount(profile.comments_count ?? 0);
        setLikesCount(profile.likes_count ?? 0);
        setSubtitle(subtitleText);
      } catch (e) {
        setUsername("Usuario");
        setEmail(null);
        setSubtitle("Estudiante UCV");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [supabase]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error cerrando sesión:', err);
    }
    // La página de login está en la raíz `/` (app/page.tsx), no en `/login`
    router.push("/");
  };

  if (loading) return <LoadingOverlay message="Cargando tu perfil..." />;

  return (
    <div className="relative min-h-screen bg-[#F8F9FD] flex flex-col items-center">
      <div className="w-full max-w-md md:max-w-2xl bg-white shadow-lg rounded-[36px] mt-6 mb-24 p-6 md:p-10 flex flex-col items-center entry-card relative overflow-hidden">
        <img
          src="/IMG-20260531-WA0042.jpg.jpeg"
          alt="logo Perdidos UCV"
          className="logo-watermark h-[220px] w-[220px]"
        />

        {/* Avatar */}
        <div className="flex flex-col items-center pop-in stagger-1 relative z-10">
          <div className="relative">
            <ProfileAvatar username={username} supabase={supabase} />
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
          <div className="fade-in-up stagger-1">
            <ProfileItem icon={<Star size={22} className="text-white" />} label="Mis Reseñas" path="/perfil/resenas" />
          </div>
          <div className="fade-in-up stagger-2">
            <ProfileItem icon={<MapPin size={22} className="text-white" />} label="Mis Lugares" path="/perfil/lugares" />
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

function ProfileAvatar({
  username,
  supabase,
}: {
  username: string | null;
  supabase: ReturnType<typeof createClient>;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        // @ts-ignore
        const metaUrl = user?.user_metadata?.avatar_url;
        if (metaUrl) setAvatarUrl(metaUrl);
      } catch (e) {
        // ignore
      }
    }
    load();
  }, [supabase]);

  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(username ?? "Usuario")}&background=A158FF&color=fff&size=128&bold=true`;

  return (
    <img
      src={avatarUrl || fallback}
      alt="Avatar"
      className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-[#8CBFED]/40 shadow-[0_18px_45px_rgba(140,191,237,0.18)] object-cover avatar-comic pop-in"
    />
  );
}