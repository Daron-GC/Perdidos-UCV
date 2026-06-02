"use client";

import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Desarrollo() {
  const [userEmail, setUserEmail] = useState("example.user@example.com");
  const [user, setUser] = useState<User | null>(null);
const router = useRouter();

    useEffect(() => {
  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/");
    } else {
      setUser(data.user);
    }
  };

  checkUser();
}, []);

  const handleLogout = () => {
    // TODO: Cerrar sesión en Supabase + redirigir
    console.log("Cerrar sesión");
  };

  return (
    <div className="bg-[#F8F9FD] min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      <div className="fixed bottom-0 left-0 w-36 h-28 bg-[#74DDD0] rounded-tr-[80px] z-0 opacity-90"></div>
      <div className="fixed bottom-0 left-0 w-16 h-16 bg-[#A1EBE3] rounded-tr-[50px] z-0 opacity-70"></div>
      <div className="fixed bottom-0 right-0 w-40 h-36 bg-[#D1A6FF] rounded-tl-[100px] z-0 opacity-80 flex justify-end items-end p-4">
        <div className="w-12 h-12 border-[3px] border-white/20 rounded-full mb-2 mr-2"></div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        <svg className="absolute top-[12%] left-[10%] text-[#A158FF] w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m15.364-6.364l-12.728 12.728m0-12.728l12.728 12.728"/>
        </svg>
        <svg className="absolute top-[35%] left-[8%] text-[#74DDD0] w-6 h-6 transform rotate-45" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0v12m0-12l-14 14"/>
        </svg>
        <svg className="absolute top-[18%] right-[12%] text-[#A158FF] w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m15.364-6.364l-12.728 12.728m0-12.728l12.728 12.728"/>
        </svg>
        <svg className="absolute top-[40%] right-[10%] text-[#74DDD0] w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
        </svg>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center relative z-10 px-5 gap-6">
        <div className="flex justify-center mb-4">
          <img src="/IMG-20260531-WA0062.jpg.jpeg" alt="Logo Perdidos UCV" className="w-[150px] h-auto object-contain" />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#A158FF]">Bienvenido</h1>
          <p className="text-3xl font-extrabold text-[#A158FF]">{userEmail}</p>
        </div>

        <div className="text-center px-6">
          <p className="text-lg font-medium text-gray-700 leading-relaxed">
            Lo sentimos, en este momento esta aplicación está en fase de prueba, dentro de poco estará disponible.
          </p>
        </div>

        <div className="w-full mt-4">
          <button
            onClick={handleLogout}
            className="relative w-full bg-[#007BFF] text-white font-bold italic tracking-wide text-2xl py-4 rounded-3xl shadow-lg hover:bg-[#0069d9] transition-all active:scale-[0.98] flex items-center justify-center"
          >
            CERRAR SESIÓN
            <svg className="btn-lines w-6 h-6 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m4.5-1.5l-2.5 2.5m5.5 2h-3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
