"use client";

interface WelcomeSidebarProps {
  userEmail?: string;
}

export default function WelcomeSidebar({ userEmail }: WelcomeSidebarProps) {
  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
      <div className="p-5 flex flex-col gap-5">
        {/* Título principal */}
        <h1 className="text-2xl font-bold text-[#A158FF]">¿Qué buscás hoy?</h1>

        {/* Tutorial (como botón) */}
        <div className="bg-gray-100 rounded-full py-2 px-4 text-center text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 transition w-fit">
          📘 Tutorial
        </div>

        {/* Tarjeta DESTACADO */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-purple-100">
          <span className="text-xs font-bold text-[#A158FF] uppercase tracking-wide">DESTACADO</span>
          <h3 className="text-md font-bold mt-1">Aquí me siento en mi clima</h3>
          <p className="text-sm text-gray-600">Full tranquilidad y buen clima</p>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>@eatudieso_uy</span>
            <span>❤️ 24</span>
          </div>
        </div>

        {/* Comentarios de usuarios */}
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-semibold text-sm">@marianag</p>
            <p className="text-xs text-gray-700">Me encanta, siempre lo que necesitaba</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="font-semibold text-sm">@olejoad23</p>
            <p className="text-xs text-gray-700">Silencio y limpio del que esté</p>
          </div>
        </div>

        {/* Email del usuario (opcional, al pie) */}
        {userEmail && (
          <div className="text-center text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
            {userEmail}
          </div>
        )}
      </div>
    </aside>
  );
}