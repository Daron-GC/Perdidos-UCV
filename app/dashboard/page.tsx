import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import DashboardSearch from '@/components/campus/DashboardSearch'

const MainMap = dynamic(() => import('@/componentes/MainMap'), { ssr: false })

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  return (
    <div className="bg-[#F8F9FD] min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decoraciones */}
      <div className="fixed bottom-0 left-0 w-36 h-28 bg-[#74DDD0] rounded-tr-[80px] z-0 opacity-90"></div>
      <div className="fixed bottom-0 right-0 w-40 h-36 bg-[#D1A6FF] rounded-tl-[100px] z-0 opacity-80 flex justify-end items-end p-4">
        <div className="w-12 h-12 border-2 border-white/30 rounded-full mb-2 mr-2"></div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col gap-6 px-5 py-8">
        <div className="rounded-[2rem] bg-white/95 border border-[#F1E8FF] p-5 shadow-[0_24px_80px_rgba(125,83,199,0.12)]">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-black text-[#A158FF] tracking-tight">Bienvenido</h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">{user.email}</p>
          </div>
          <DashboardSearch />
        </div>

        <div className="rounded-[2rem] overflow-hidden shadow-[0_28px_80px_rgba(125,83,199,0.12)]">
          <MainMap user={user} />
        </div>
      </div>
    </div>
  )
}