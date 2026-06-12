"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getUserProfile } from "./actions";

export default function ProfilePage() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { username } = await getUserProfile();
      setUsername(username || "Usuario");
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) return <div className="p-4">Cargando perfil...</div>;

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=A158FF&color=fff`}
          className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-purple-200"
          alt="Perfil"
        />
        <h1 className="text-2xl font-bold text-gray-800">{username}</h1>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}