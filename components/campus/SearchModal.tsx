"use client";

import { useState } from "react";

const lugares = [
  { id: 1, nombre: "Jardín Botánico", ubicacion: "Norte" },
  { id: 2, nombre: "Facultad de Ciencias", ubicacion: "Este" },
  { id: 3, nombre: "Biblioteca Central", ubicacion: "Oeste" },
  { id: 4, nombre: "Estadio Olímpico", ubicacion: "Sur" },
  { id: 5, nombre: "Aula Magna", ubicacion: "Centro" },
];

export default function SearchModal({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState("");

  const lugaresFiltrados = lugares.filter(lugar =>
    lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (lugar: typeof lugares[0]) => {
    console.log("Lugar seleccionado:", lugar);
    // Aquí luego puedes centrar el mapa o agregar un marcador
    onClose(); // cierra el modal
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-96 max-w-[90%] p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-[#A158FF] mb-3">Buscar lugar</h2>
        <input
          type="text"
          placeholder="Escribe el nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          autoFocus
        />
        {searchTerm && (
          <ul className="mt-3 max-h-60 overflow-y-auto">
            {lugaresFiltrados.map((lugar) => (
              <li
                key={lugar.id}
                onClick={() => handleSelect(lugar)}
                className="px-3 py-2 hover:bg-purple-50 cursor-pointer rounded-md border-b last:border-0"
              >
                <span className="font-medium">{lugar.nombre}</span>
                <span className="text-xs text-gray-500 ml-2">({lugar.ubicacion})</span>
              </li>
            ))}
            {lugaresFiltrados.length === 0 && (
              <p className="text-sm text-gray-500 mt-2 text-center">No se encontraron lugares</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}