"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Completa todos los campos");
      return;
    }

    setIsLoading(true);

    const authPromise = supabase.auth.signInWithPassword({
      email,
      password,
    });
    const delayPromise = new Promise((resolve) => setTimeout(resolve, 2000));

    const { error } = await authPromise;
    await delayPromise;

    if (error) {
      setIsLoading(false);
      alert(error.message);
      return;
    }

    await router.push("/desarrollo");
    setIsLoading(false);
  };

  return (
    <div className="bg-[#F8F9FD] min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm relative flex flex-col">
        <div className="flex justify-center items-center mb-10 z-10">
          <img src="/IMG-20260531-WA0042.jpg.jpeg" alt="Logo Perdidos UCV" className="h-40 w-auto" />
        </div>

        <div className="z-10 bg-white p-8 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F9F9F9] border border-gray-100 text-gray-800 rounded-2xl py-4 pl-14 pr-4 outline-none focus:border-blue-400 transition"
            />
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F9F9F9] border border-gray-100 text-gray-800 rounded-2xl py-4 pl-14 pr-12 outline-none focus:border-blue-400 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <svg className="h-6 w-6 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5 16.477 5 20.268 7.943 21.542 12 20.268 16.057 16.477 19 12 19 7.523 19 3.732 16.057 2.458 12z" />
                  </>
                )}
              </svg>
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-[#007BFF] text-white text-xl font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            INGRESAR
          </button>

          <div className="text-center mt-6">
            <p className="text-gray-500 font-medium">¿No tienes cuenta?</p>
            <Link href="/register" className="text-[#7D53C7] font-bold flex items-center justify-center gap-1 hover:underline">
              Regístrate aquí
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {isLoading && <LoadingOverlay message="Iniciando sesión..." />}

        {/* Decoraciones inferiores */}
        <div className="fixed bottom-0 left-0 w-32 h-24 bg-[#74DDD0] rounded-tr-[70px] z-0 opacity-90"></div>
        <div className="fixed bottom-0 right-0 w-40 h-32 bg-[#D1A6FF] rounded-tl-[80px] z-0 opacity-80"></div>
      </div>
    </div>
  );
}