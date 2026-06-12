"use client"
import { useState } from 'react'
import { createClient } from '../../lib/supabase'
import Link from 'next/link'

export default function Registro() {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function registrar() {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password: pass
    })
    if (error) alert(error.message)
    else alert('¡Cuenta creada!')
  }

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

      <div className="w-full max-w-sm flex flex-col relative z-10 px-5">
        <div className="flex justify-center items-center mb-6 pl-2">
          <img src="/IMG-20260531-WA0062.jpg.jpeg" alt="Logo Perdidos UCV" className="h-40 w-auto" />
        </div>

        <div className="bg-white p-6 rounded-[30px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3.5 pl-12 pr-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 shadow-sm transition-all placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full py-3.5 pl-12 pr-12 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 shadow-sm transition-all placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {showPassword ? (
                  <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                ) : (
                  <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                )}
              </svg>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repetir contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full py-3.5 pl-12 pr-12 bg-white border border-gray-100 rounded-2xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 shadow-sm transition-all placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {showConfirmPassword ? (
                  <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                ) : (
                  <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                )}
              </svg>
            </button>
          </div>

          <button
            onClick={registrar}
            className="relative w-full mt-2 bg-[#007BFF] text-white font-bold italic tracking-wide text-lg py-3.5 rounded-2xl shadow-md hover:bg-[#0069d9] transition-all active:scale-[0.98] flex items-center justify-center"
          >
            CREAR CUENTA
            <svg className="btn-lines w-5 h-5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m4.5-1.5l-2.5 2.5m5.5 2h-3" />
            </svg>
          </button>

          <div className="text-center mt-3 text-[14px]">
            <span className="text-gray-500 font-medium">¿Ya tienes cuenta?</span><br />
            <Link href="/" className="text-[#7D53C7] font-bold flex items-center justify-center gap-1 mt-1 hover:underline">
              Inicia sesión aquí
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
