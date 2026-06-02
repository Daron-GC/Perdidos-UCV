import { createClient } from '@/utils/supabase/server'
import { logoutAction } from '../actions'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  // 1. Crear el cliente de servidor para leer cookies
  const supabase = await createClient()

  // 2. Obtener el usuario actual asíncronamente (protección)
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Protección de ruta: Si no hay usuario, redirigir al login
  if (!user) {
    redirect('/')
  }

  return (
    <body className="bg-[#F8F9FD] min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      {/* Símbolos decorativos fijas (Turquesa y Morado) */}
      <div className="fixed bottom-0 left-0 w-36 h-28 bg-[#74DDD0] rounded-tr-[80px] z-0 opacity-90"></div>
      <div className="fixed bottom-0 right-0 w-40 h-36 bg-[#D1A6FF] rounded-tl-[100px] z-0 opacity-80 flex justify-end items-end p-4">
        <div className="w-12 h-12 border-2 border-white/30 rounded-full mb-2 mr-2"></div>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center relative z-10 px-5 gap-6">

        {/* Sección del Logo (PNG Único centrado arriba) */}
        <div className="flex justify-center mb-4">
          {/* logo aquí */}
          <img src="/logo-completo.png" alt="Logo de Perdidos UCV (incluye textos)" className="h-40 w-auto" />
        </div>

        {/* Texto de Bienvenida Dinámico (usando user.email) */}
        <div className="text-center">
            <h1 className="text-3xl font-bold text-[#A158FF]">Bienvenido</h1>
            <p className="text-2xl font-extrabold text-[#A158FF] break-all">{user.email}</p>
        </div>

        {/* Párrafo de Estado de Fase de Prueba */}
        <div className="text-center px-6">
            <p className="text-lg font-medium text-gray-700 leading-relaxed">
                Lo sentimos, en este momento esta aplicación está en fase de prueba, dentro de poco estará disponible.
            </p>
        </div>

        {/* Botón Cerrar Sesión llamando a logoutAction en un formulario */}
        <form action={logoutAction} className="w-full mt-4">
            <button type="submit" className="w-full bg-[#007BFF] text-white font-extrabold italic tracking-wider text-2xl py-4 rounded-3xl shadow-lg hover:bg-[#0069d9] transition-all flex items-center justify-center">
                CERRAR SESIÓN
            </button>
        </form>

      </div>
    </body>
  )
}
