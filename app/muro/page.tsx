"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { createComentario, getComentarios, likeComentario, deleteComentario, createUbicacion, getUbicaciones, getUbicacionById} from "@/lib/funciones";

const supabase = createClient();

// 👉 AQUÍ IRÍAN TUS FUNCIONES CRUD IMPORTADAS
// import { getPlace, getComments, getFeaturedComment, toggleLike, addComment, ratePlace } from "@/lib/api";

type Place = {
  id?: string;
  name?: string;
  description?: string;
  schedule?: string;
  image?: string;
  mapImage?: string;
  avgRating?: string;
};

type CommentItem = {
  id: string;
  user: string;
  text: string;
  likes: number;
};

type FeaturedComment = {
  text?: string;
  user?: string;
};

const LibraryDetail: React.FC = () => {

  // =========================
  // ESTADOS (DATA DINÁMICA)
  // =========================

  const [place, setPlace] = useState<Place | null>(null);
  const [featuredComment, setFeaturedComment] = useState<FeaturedComment | null>(null);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState<number>(0);

  // =========================
  // FETCH INICIAL
  // =========================

  useEffect(() => {
    const loadData = async () => {

      // 👉 aquí va función leer datos del lugar (Supabase)
      // const data = await getPlace(id);
      // setPlace(data);

      // 👉 aquí va función leer comentario destacado
      // const featured = await getFeaturedComment(id);
      // setFeaturedComment(featured);

      // 👉 aquí va función leer comentarios normales
      // const list = await getComments(id);
      // setComments(list);

    };

    loadData();
  }, []);

  // =========================
  // ACCIONES
  // =========================

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    // 👉 aquí va función crear comentario
    // await addComment({ text: newComment, placeId: place.id });

    setNewComment("");

    // 👉 aquí va función refrescar comentarios
    // const updated = await getComments(place.id);
    // setComments(updated);
  };

  const handleLike = async (commentId: string) => {

    // 👉 aquí va función like comentario
    // await toggleLike(commentId);

    // 👉 refrescar lista
    // const updated = await getComments(place.id);
    // setComments(updated);
  };

  const handleRating = async (value: number) => {
    setRating(value);

    // 👉 aquí va función puntuar lugar
    // await ratePlace({ placeId: place.id, value });
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="relative mx-auto max-w-md min-h-screen bg-slate-100 overflow-hidden font-sans shadow-2xl rounded-[40px] border border-gray-200">

      {/* MAPA */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: place?.mapImage
            ? `url('${place.mapImage}')`
            : "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600&auto=format&fit=crop')",
          opacity: 0.6
        }}
      ></div>

      {/* BOTONES SUPERIORES */}
      <div className="absolute top-6 inset-x-6 z-10 flex justify-between items-center">

        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          {/* aquí va función goBack */}
        </button>

        <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          {/* aquí va función toggle favorito */}
        </button>

      </div>

      {/* PANEL */}
      <div className="absolute bottom-0 inset-x-0 z-10 bg-white/95 backdrop-blur-md rounded-t-[36px] shadow-[0_-10px_25px_rgba(0,0,0,0.05)] flex flex-col max-h-[82%]">

        <div className="overflow-y-auto px-6 pb-24 space-y-5">

          {/* =========================
              HEADER PLACE
          ========================= */}
          <div className="flex gap-4 items-start">

            <img
              className="w-32 h-32 rounded-2xl object-cover"
              src={place?.image}
              alt="Place"
            />

            <div className="flex-1">

              <h2 className="text-xl font-black uppercase">
                {/* aquí va place.title */}
                {place?.name || "Cargando..."}
              </h2>

              <p className="text-sm text-gray-600">
                {/* aquí va place.description */}
                {place?.description}
              </p>

              <div className="mt-3 text-xs text-gray-700">
                {/* aquí va place.schedule */}
                {place?.schedule}
              </div>

            </div>
          </div>

          {/* =========================
              RATING
          ========================= */}
          <div className="flex items-center gap-1">

            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className="text-2xl"
              >
                {star <= rating ? "★" : "☆"}
              </button>
            ))}

            <span className="ml-4 text-sm">
              {/* aquí va rating promedio desde backend */}
              {place?.avgRating || "0.0"}
            </span>

          </div>

          {/* =========================
              FEATURED COMMENT
          ========================= */}
          <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4">

            {/* aquí va función leer comentario destacado */}
            <p>{featuredComment?.text}</p>
            <span>{featuredComment?.user}</span>

          </div>

          <hr />

          {/* =========================
              COMMENTS LIST
          ========================= */}
          <div className="space-y-4">

            {/* aquí va función map comentarios */}
            {comments.map((c) => (
              <div key={c.id} className="flex justify-between">

                <div>
                  <p className="font-bold">{c.user}</p>
                  <p>{c.text}</p>
                </div>

                <button onClick={() => handleLike(c.id)}>
                  ❤️ {c.likes}
                </button>

              </div>
            ))}
          </div>
        </div>

        {/* =========================
            INPUT COMMENT
        ========================= */}
        <div className="absolute bottom-0 inset-x-0 bg-white/90 px-4 py-3 flex gap-3">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario..."
            className="flex-1 bg-gray-50 p-3 rounded-xl"
          />
          <button onClick={handleAddComment}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  )
}

export default LibraryDetail;
