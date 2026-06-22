"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Comment = {
  id: number;
  user: string;
  username: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  likedByMe: boolean;
};

type LocationData = {
  name: string;
  description: string;
  image: string;
  horarios?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

type RatingSnapshot = {
  total: number;
  count: number;
};

const RATING_PREFIX = "__RATING__:";

const isRatingEntry = (text: string) => text.startsWith(RATING_PREFIX);

const parseRatingValue = (text: string) => {
  const raw = text.replace(RATING_PREFIX, "").trim();
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 1 && parsed <= 5 ? parsed : null;
};

const dedupeComments = (comments: Comment[]) => {
  const seen = new Set<number>();
  return comments.filter((comment) => {
    if (seen.has(comment.id)) {
      return false;
    }
    seen.add(comment.id);
    return true;
  });
};

const loadRatingsFromSupabase = async (
  supabaseClient: ReturnType<typeof createClient>,
  locationId: number
) => {
  const { data, error } = await supabaseClient
    .from("comentarios")
    .select("contenido, ubicacion_id")
    .eq("ubicacion_id", locationId);

  if (error || !data) {
    return {} as Record<number, RatingSnapshot>;
  }

  const ratingTotals = (data as Array<{ ubicacion_id: number | null; contenido: string | null }>).reduce(
    (acc, item) => {
      if (!item.ubicacion_id || !item.contenido) return acc;

      const ratingValue = parseRatingValue(item.contenido);
      if (ratingValue == null) return acc;

      const current = acc[item.ubicacion_id] || { total: 0, count: 0 };
      return {
        ...acc,
        [item.ubicacion_id]: {
          total: current.total + ratingValue,
          count: current.count + 1,
        },
      };
    },
    {} as Record<number, RatingSnapshot>
  );

  return ratingTotals;
};

const getCurrentUserId = async (supabaseClient: ReturnType<typeof createClient>) => {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser();

  if (userError || !user?.email) {
    return null;
  }

  const { data: usuarioRows, error: usuarioError } = await supabaseClient
    .from("usuario")
    .select("id")
    .eq("email", user.email)
    .limit(1);

  if (usuarioError || !usuarioRows || usuarioRows.length === 0) {
    return null;
  }

  const usuarioData = usuarioRows[0];

  if (!usuarioData?.id) {
    return null;
  }

  return usuarioData.id as number;
};

const loadLikesByComment = async (
  supabaseClient: ReturnType<typeof createClient>,
  commentIds: number[]
) => {
  if (commentIds.length === 0) {
    return { counts: {} as Record<number, number>, likedByMe: new Set<number>() };
  }

  const [likesDataResult, userId] = await Promise.all([
    supabaseClient
      .from('like')
      .select('id_comentario, user_id')
      .in('id_comentario', commentIds),
    getCurrentUserId(supabaseClient),
  ]);

  const { data: likesData, error: likesError } = likesDataResult;

  if (likesError || !likesData) {
    return { counts: {} as Record<number, number>, likedByMe: new Set<number>() };
  }

  const counts = {} as Record<number, number>;
  const seenLikeKeys = new Set<string>();

  (likesData as Array<{ id_comentario: number | null; user_id: number | null }>).forEach(
    (row) => {
      if (typeof row.id_comentario !== 'number' || typeof row.user_id !== 'number') {
        return;
      }

      const likeKey = `${row.id_comentario}:${row.user_id}`;
      if (seenLikeKeys.has(likeKey)) {
        return;
      }

      seenLikeKeys.add(likeKey);
      counts[row.id_comentario] = (counts[row.id_comentario] || 0) + 1;
    }
  );

  const likedByMe = new Set<number>();

  if (userId) {
    (likesData as Array<{ id_comentario: number | null; user_id: number | null }>).forEach(
      (row) => {
        if (row.user_id === userId && typeof row.id_comentario === 'number') {
          likedByMe.add(row.id_comentario);
        }
      }
    );
  }

  return { counts, likedByMe };
};

const loadUserEmailsByIds = async (
  supabaseClient: ReturnType<typeof createClient>,
  userIds: number[]
) => {
  if (userIds.length === 0) {
    return {} as Record<number, string>;
  }

  const { data, error } = await supabaseClient
    .from('usuario')
    .select('id, email')
    .in('id', userIds);

  if (error || !data) {
    return {} as Record<number, string>;
  }

  return (data as Array<{ id: number; email: string | null }>).reduce(
    (acc, row) => {
      if (row.id != null && row.email) {
        acc[row.id] = row.email;
      }
      return acc;
    },
    {} as Record<number, string>
  );
};

function Star({
  filled,
  size = 22,
}: {
  filled: boolean;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "#FACC15" : "none"}
      stroke={filled ? "#FACC15" : "#D1D5DB"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15 9 22 9 17 14 19 22 12 18 5 22 7 14 2 9 9 9" />
    </svg>
  );
}

function HeartIcon({ filled = false }: { filled?: boolean }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill={filled ? "#FF5C8A" : "none"}
      stroke={filled ? "#FF5C8A" : "#111827"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6c-1.5-1.6-4-1.7-5.6-.1L12 7.7l-3.2-3.2C7.2 2.9 4.7 3 3.2 4.6c-1.7 1.8-1.6 4.7.2 6.4L12 19.5l8.6-8.5c1.8-1.8 1.9-4.6.2-6.4z" />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#111827"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#111827"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

export default function CommentsScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedLocationId = useMemo(() => {
    const raw = searchParams.get("ubicacionId");
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }, [searchParams]);
  const selectedLocationName = searchParams.get("ubicacionNombre") || "";

  const [locationData, setLocationData] = useState<LocationData>({
    name: selectedLocationName || "Cargando...",
    description: "Cargando descripción...",
    image: "📍",
    horarios: null,
  });
  const [locationId, setLocationId] = useState<number | null>(selectedLocationId);
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVisible] = useState(true);
  const [showRatingPicker, setShowRatingPicker] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [ratingsByLocation, setRatingsByLocation] = useState<
    Record<number, RatingSnapshot>
  >({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const totalLikes = commentsList.reduce((sum, comment) => sum + comment.likes, 0);
  const currentLocationRating = locationId
    ? ratingsByLocation[locationId]
    : null;
  const ratingCount = currentLocationRating?.count ?? 0;
  const averageRating =
    currentLocationRating && ratingCount > 0
      ? currentLocationRating.total / ratingCount
      : 0;
  const featuredComment = [...commentsList]
    .filter((comment) => comment.likes > 0)
    .sort((a, b) => b.likes - a.likes || b.id - a.id)[0];
  const shouldShowFeatured = totalLikes >= 5 && Boolean(featuredComment);
  const hasImageUrl = Boolean(
    locationData.image && /^https?:\/\//i.test(locationData.image)
  );

  useEffect(() => {
    const fetchLocationData = async () => {
      if (!selectedLocationId) {
        setLocationId(null);
        setLocationData({
          name: selectedLocationName || "Ubicación no seleccionada",
          description: "Selecciona un lugar en el mapa para ver sus comentarios.",
          image: "📍",
          horarios: null,
        });
        setCommentsList([]);
        return;
      }

      const { data, error } = await supabase
        .from("ubicaciones")
        .select("id, nombre_ubicacion, descripcion, horarios, latitud, longitud, IMG")
        .eq("id", selectedLocationId)
        .maybeSingle();

      if (!error && data) {
        setLocationId(data.id ?? selectedLocationId);
        setLocationData({
          name:
            data.nombre_ubicacion ||
            selectedLocationName ||
            "Biblioteca",
          description: data.descripcion || "Sin descripción disponible.",
          image: data.IMG || "📚",
          horarios: data.horarios ?? null,
          latitude: data.latitud ?? null,
          longitude: data.longitud ?? null,
        });
      }
    };

    const fetchComments = async () => {
      setLoading(true);

      const currentLocationId = selectedLocationId ?? locationId;

      if (!currentLocationId) {
        setCommentsList([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("comentarios")
        .select(
          "id, contenido, user_id, destacado, ubicacion_id"
        )
        .eq("ubicacion_id", currentLocationId)
        .order("id", { ascending: false });

      if (!error && data) {
        const commentRows = (data as Array<{ contenido: string | null; id: number; user_id: number | null }>).filter(
          (item) => !isRatingEntry(item.contenido || "")
        );
        const commentIds = commentRows.map((item) => item.id);
        const { counts, likedByMe } = await loadLikesByComment(supabase, commentIds);

        const userIds = Array.from(
          new Set(
            commentRows
              .map((item) => item.user_id)
              .filter((id): id is number => typeof id === 'number')
          )
        );
        const userEmails = await loadUserEmailsByIds(supabase, userIds);

        const comments = dedupeComments(
          commentRows.map((item) => {
            const authorEmail =
              item.user_id != null && userEmails[item.user_id]
                ? userEmails[item.user_id]
                : null;

            return {
              id: item.id,
              user: authorEmail || (item.user_id != null ? `Usuario ${item.user_id}` : "Usuario"),
              username: authorEmail || (item.user_id != null ? `Usuario ${item.user_id}` : "Usuario"),
              avatar: "👤",
              time: `#${item.id}`,
              text: item.contenido || "",
              likes: counts[item.id] || 0,
              likedByMe: likedByMe.has(item.id),
            };
          })
        );

        const ratingTotals = await loadRatingsFromSupabase(supabase, currentLocationId);
        setRatingsByLocation(ratingTotals);
        setCommentsList(comments);
      } else {
        setCommentsList([]);
        setRatingsByLocation({});
      }
      setLoading(false);
    };

    fetchLocationData();
    fetchComments();
  }, [selectedLocationId, selectedLocationName, locationId]);

  const handleSendComment = async () => {
    const text = newCommentText.trim();
    if (!text) return;

    try {
      setErrorMessage("");

      const currentLocationId = selectedLocationId ?? locationId;

      if (!currentLocationId) {
        setErrorMessage("Selecciona una ubicación antes de comentar.");
        return;
      }

      const { data: locationRow, error: locationError } = await supabase
        .from("ubicaciones")
        .select("id")
        .eq("id", currentLocationId)
        .maybeSingle();

      if (locationError) {
        console.error("Error validando ubicación:", locationError);
        setErrorMessage("No se pudo validar la ubicación actual.");
        return;
      }

      if (!locationRow?.id) {
        setErrorMessage(
          "La ubicación seleccionada ya no existe. Selecciona otra ubicación antes de comentar."
        );
        return;
      }

      setLocationId(locationRow.id);

      const currentUserId = await getCurrentUserId(supabase);
      const currentUserEmail =
        currentUserId != null
          ? (
              await supabase
                .from("usuario")
                .select("email")
                .eq("id", currentUserId)
                .maybeSingle()
            ).data?.email ?? null
          : null;

      const { data: insertedRows, error } = await supabase
        .from("comentarios")
        .insert([
          {
            contenido: text,
            user_id: currentUserId,
            like: false,
            destacado: false,
            ubicacion_id: locationRow.id,
          },
        ])
        .select(
          "id, contenido, user_id, like, destacado, ubicacion_id"
        );

      if (error) {
        console.error("Error al publicar comentario:", error);

        if (error.code === "23503") {
          setErrorMessage(
            "La ubicación seleccionada no es válida para guardar el comentario."
          );
        } else if (error.code === "42501") {
          setErrorMessage(
            "No se puede publicar el comentario porque la tabla bloquea inserciones desde esta sesión."
          );
        } else {
          setErrorMessage(
            `No se pudo publicar el comentario. ${error.message || "Error desconocido."}`
          );
        }
        return;
      }

      setNewCommentText("");

      const insertedCommentData = insertedRows?.[0];
      if (insertedCommentData) {
        const insertedComment = {
          id: insertedCommentData.id,
          user:
            currentUserEmail ||
            (insertedCommentData.user_id != null
              ? `Usuario ${insertedCommentData.user_id}`
              : "Usuario"),
          username:
            currentUserEmail ||
            (insertedCommentData.user_id != null
              ? `Usuario ${insertedCommentData.user_id}`
              : "Usuario"),
          avatar: "👤",
          time: `#${insertedCommentData.id}`,
          text: insertedCommentData.contenido || "",
          likes: 0,
          likedByMe: false,
        };

        setCommentsList((prev) => dedupeComments([insertedComment, ...prev]));
      }
    } catch (error) {
      console.error("Error inesperado al publicar:", error);
      setErrorMessage("No se pudo publicar el comentario.");
    }
  };

  const handleLike = async (id: number, likedByMe: boolean) => {
    try {
      const userId = await getCurrentUserId(supabase);

      if (!userId) {
        setErrorMessage("Debes iniciar sesión para dar like.");
        return;
      }

      const { data: existingLikes, error: existingLikeError } = await supabase
        .from('like')
        .select('id')
        .eq('user_id', userId)
        .eq('id_comentario', id);

      if (existingLikeError) {
        console.error(existingLikeError);
        setErrorMessage("No se pudo actualizar el like.");
        return;
      }

      const existingLikeRows = (existingLikes as Array<{ id: number }> | null) ?? [];

      if (likedByMe && existingLikeRows.length > 0) {
        const { error: deleteError } = await supabase
          .from('like')
          .delete()
          .in(
            'id',
            existingLikeRows.map((row) => row.id)
          );

        if (deleteError) {
          console.error(deleteError);
          setErrorMessage("No se pudo quitar el like.");
          return;
        }

        setCommentsList((prev) =>
          prev.map((comment) =>
            comment.id === id
              ? { ...comment, likes: Math.max(0, comment.likes - 1), likedByMe: false }
              : comment
          )
        );
      } else if (!likedByMe && existingLikeRows.length === 0) {
        const { error: insertError } = await supabase
          .from('like')
          .insert([
            {
              user_id: userId,
              id_comentario: id,
            },
          ]);

        if (insertError) {
          console.error(insertError);
          setErrorMessage(
            insertError.code === '42501'
              ? 'No tienes permiso para guardar este like en la base de datos.'
              : 'No se pudo registrar el like.'
          );
          return;
        }

        setCommentsList((prev) =>
          prev.map((comment) =>
            comment.id === id
              ? { ...comment, likes: comment.likes + 1, likedByMe: true }
              : comment
          )
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo actualizar el like.");
    }
  };

  const handleRateLocation = async (rating: number) => {
    try {
      const nextLocationId = locationId ?? selectedLocationId;
      if (!nextLocationId) return;

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user?.email) {
        setErrorMessage("Debes iniciar sesión para puntuar.");
        return;
      }

      const { data: usuarioData } = await supabase
        .from("usuario")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      const userId = usuarioData?.id ?? null;

      if (userId === null) {
        setErrorMessage("No se encontró tu usuario para guardar la puntuación.");
        return;
      }

      const { data: existingRatings, error: fetchError } = await supabase
        .from("comentarios")
        .select("id, contenido, ubicacion_id, user_id")
        .eq("ubicacion_id", nextLocationId)
        .eq("user_id", userId);

      if (!fetchError && existingRatings) {
        const existingRatingRows = (existingRatings as Array<Record<string, unknown>> | null) ?? [];
        const previouslyRated = existingRatingRows.filter((entry) =>
          isRatingEntry(String(entry?.contenido || ""))
        );

        if (previouslyRated.length > 0) {
          const idsToDelete = previouslyRated
            .map((entry) => entry.id)
            .filter((id): id is number => typeof id === "number");

          if (idsToDelete.length > 0) {
            await supabase.from("comentarios").delete().in("id", idsToDelete);
          }
        }
      }

      const { error } = await supabase.from("comentarios").insert([
        {
          contenido: `${RATING_PREFIX}${rating}`,
          user_id: userId,
          like: false,
          destacado: false,
          ubicacion_id: nextLocationId,
        },
      ]);

      if (!error) {
        setSelectedRating(rating);
        const refreshedRatings = await loadRatingsFromSupabase(supabase, nextLocationId);
        setRatingsByLocation(refreshedRatings);
        setShowRatingPicker(false);
      } else {
        setErrorMessage("No se pudo guardar la puntuación.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo guardar la puntuación.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase.from("comentarios").delete().eq("id", id);
      if (!error) {
        setCommentsList((prev) => prev.filter((comment) => comment.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#EEF7F2]">
      <div className="absolute inset-0 z-0 bg-[#EEF7F2]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.75),_transparent_22%)]" />
        <svg className="h-full w-full" viewBox="0 0 400 300" fill="none" preserveAspectRatio="none">
          <path d="M-20 50C60 80 100 20 180 60C260 100 300 20 420 80" stroke="#DDEED8" strokeWidth="28" strokeLinecap="round" />
          <path d="M-20 180C50 140 120 220 200 170C260 130 320 190 420 140" stroke="#DDEED8" strokeWidth="24" strokeLinecap="round" />
          <path d="M40 -20C80 60 120 100 80 320" stroke="#E7F5E4" strokeWidth="18" strokeLinecap="round" />
          <path d="M260 -20C240 60 310 120 290 320" stroke="#E7F5E4" strokeWidth="20" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div
          className={`w-full max-w-sm overflow-hidden rounded-[34px] border border-white bg-white shadow-[0_10px_35px_rgba(0,0,0,0.08)] transition-all duration-500 ease-out ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
        <div className="relative h-[180px] overflow-hidden bg-[#EAF7E8]">
          <div className="absolute inset-0 opacity-70">
            <svg className="h-full w-full" viewBox="0 0 400 300" fill="none">
              <path d="M-20 50C60 80 100 20 180 60C260 100 300 20 420 80" stroke="#DDEED8" strokeWidth="28" strokeLinecap="round" />
              <path d="M-20 180C50 140 120 220 200 170C260 130 320 190 420 140" stroke="#DDEED8" strokeWidth="24" strokeLinecap="round" />
              <path d="M40 -20C80 60 120 100 80 320" stroke="#E7F5E4" strokeWidth="18" strokeLinecap="round" />
              <path d="M260 -20C240 60 310 120 290 320" stroke="#E7F5E4" strokeWidth="20" strokeLinecap="round" />
            </svg>
          </div>

          <div className="absolute left-4 top-4 z-10">
            <button
              type="button"
              aria-label="Volver al mapa"
              onClick={() => router.push("/mapa")}
              className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#111827] shadow-[0_8px_22px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)] active:scale-95 active:bg-[#F3F4F6] active:shadow-[inset_0_0_0_1px_rgba(124,58,237,0.15),0_10px_24px_rgba(124,58,237,0.18)]"
            >
              <BackIcon />
              <span className="pointer-events-none absolute -bottom-8 rounded-full bg-[#111827] px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100">
                Mapa
              </span>
            </button>
          </div>

          <div className="absolute right-4 top-4 z-10">
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
              <HeartIcon filled />
            </button>
          </div>
        </div>

        <section className="relative -mt-10 rounded-t-[34px] bg-white px-5 pb-5 pt-4">
          <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-[#D1D5DB]" />

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => hasImageUrl && setIsImageModalOpen(true)}
              className={`h-28 w-28 shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-[#00F5D4] to-[#00BBF9] p-[2px] ${hasImageUrl ? "cursor-zoom-in" : "cursor-default"}`}
              disabled={!hasImageUrl}
            >
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[22px] bg-[#E5E7EB]">
                {hasImageUrl ? (
                  <img
                    src={locationData.image}
                    alt={locationData.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-5xl">{locationData.image}</span>
                )}
              </div>
            </button>

            <div className="flex flex-1 flex-col">
              <h1 className="text-[28px] leading-[1] text-black uppercase" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                {locationData.name}
              </h1>

              <div className="mt-2 h-1 w-28 rounded-full bg-[#00F5D4]" />

              <p className="mt-3 text-[14px] leading-5 text-[#4B5563]">
                {locationData.description}
              </p>

              <div className="mt-3 space-y-1 text-[13px] text-[#4B5563]">
                {locationData.horarios ? (
                  <p className="whitespace-pre-line">🕒 {locationData.horarios}</p>
                ) : (
                  <p className="text-[12px] text-[#6B7280]">Horario no disponible</p>
                )}
                {selectedLocationId ? (
                  <p className="text-[12px] text-[#6B7280]">
                    ID ubicación: {selectedLocationId}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} filled={star <= Math.round(averageRating)} />
              ))}
            </div>

            <span className="ml-2 text-sm font-semibold text-[#374151]">
              {averageRating > 0 ? `${averageRating.toFixed(1)}` : "Sin puntuaciones aún"}
              {ratingCount > 0 ? ` (${ratingCount})` : ""}
            </span>
          </div>

          {showRatingPicker ? (
            <div className="mt-3 rounded-2xl border border-[#E5E7EB] bg-[#FAFAFA] p-3">
              <p className="text-xs font-semibold text-[#6B7280]">Tu puntuación</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRateLocation(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star filled={star <= selectedRating || star <= Math.round(averageRating)} />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowRatingPicker(false)}
                  className="text-xs font-medium text-[#7C3AED]"
                >
                  Cerrar
                </button>
              </div>
            </div>
          ) : null}

          {shouldShowFeatured && featuredComment ? (
            <div className="mt-5 rounded-[28px] border-2 border-[#9B5DE5]/40 bg-[#FAF7FF] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xl">📣</span>
                    <h2 className="text-lg text-[#7C3AED]" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                      DESTACADO
                    </h2>
                  </div>

                  <p className="text-[15px] leading-6 text-[#1F2937]">
                    {featuredComment.text}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-[#7C3AED]">
                    — @{featuredComment.username}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <HeartIcon filled />
                  <span className="text-lg font-semibold text-[#111827]">
                    {featuredComment.likes}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-4 space-y-4 pb-2">
            {loading ? (
              <p className="text-center text-sm text-[#9CA3AF] py-4">Cargando comentarios...</p>
            ) : commentsList.length > 0 ? (
              commentsList.map((comment) => (
                <div key={comment.id} className="flex items-start justify-between gap-3 border-b border-[#F3F4F6] pb-4">
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9D5FF] text-2xl">
                      {comment.avatar}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#7C3AED]">{comment.username}</span>
                        <span className="text-xs text-[#9CA3AF]">• {comment.time}</span>
                      </div>

                      <p className="mt-1 max-w-[210px] text-[15px] leading-6 text-[#1F2937]">{comment.text}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <button onClick={() => handleLike(comment.id, comment.likedByMe)}>
                      <HeartIcon filled={comment.likedByMe} />
                    </button>
                    <span className="text-xs font-semibold text-[#6B7280]">{comment.likes}</span>
                    <button onClick={() => handleDelete(comment.id)} className="text-gray-400 hover:text-red-500" aria-label="Eliminar comentario">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-[#9CA3AF] py-4">No hay comentarios aún. ¡Sé el primero!</p>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-2 pb-6 pt-2">
            {errorMessage ? <p className="text-xs text-red-500">{errorMessage}</p> : null}
            <div className="flex items-center gap-3">
              <div className="flex flex-1 items-center rounded-2xl border-2 border-[#E5E7EB] bg-white px-4 py-3">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSendComment();
                    }
                  }}
                  placeholder="Escribe tu comentario..."
                  className="flex-1 bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF]"
                />

                <button
                  type="button"
                  onClick={handleSendComment}
                  className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6]"
                >
                  <SendIcon />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowRatingPicker((prev) => !prev)}
                className="flex h-[74px] w-[74px] flex-col items-center justify-center rounded-3xl border-2 border-[#FFE58F] bg-[#FFFBEA] transition-transform hover:scale-105"
              >
                <Star filled={selectedRating > 0} />
                <span className="mt-1 text-xs font-semibold text-[#111827]">Puntuar</span>
              </button>
            </div>
          </div>
        </section>
        </div>
      </div>

      {isImageModalOpen && hasImageUrl ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setIsImageModalOpen(false)}
              aria-label="Cerrar imagen"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
            >
              ✕
            </button>
            <img
              src={locationData.image}
              alt={locationData.name}
              className="max-h-[90vh] w-full object-contain"
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}