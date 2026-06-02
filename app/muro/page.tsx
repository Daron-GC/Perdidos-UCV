"use client";

import React from "react";

type Comment = {
  id: number;
  user: string;
  username: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
};

const comments: Comment[] = [
  {
    id: 1,
    user: "Mariana",
    username: "@marianap_",
    avatar: "👩🏽",
    time: "Hace 2h",
    text: "Me encanta, siempre consigo los libros que necesito 💚",
    likes: 12,
  },
  {
    id: 2,
    user: "Alejo",
    username: "@alejoo23",
    avatar: "🧑🏻",
    time: "Hace 1d",
    text: "Silencioso y limpio. Ideal para estudiar.",
    likes: 8,
  },
];

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
  return (
    <main className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm overflow-hidden rounded-[34px] bg-white shadow-[0_10px_35px_rgba(0,0,0,0.08)] border border-white">
        {/* MAP BG */}
        <div className="relative h-[180px] overflow-hidden bg-[#EAF7E8]">
          <div className="absolute inset-0 opacity-70">
            <svg
              className="h-full w-full"
              viewBox="0 0 400 300"
              fill="none"
            >
              <path
                d="M-20 50C60 80 100 20 180 60C260 100 300 20 420 80"
                stroke="#DDEED8"
                strokeWidth="28"
                strokeLinecap="round"
              />
              <path
                d="M-20 180C50 140 120 220 200 170C260 130 320 190 420 140"
                stroke="#DDEED8"
                strokeWidth="24"
                strokeLinecap="round"
              />
              <path
                d="M40 -20C80 60 120 100 80 320"
                stroke="#E7F5E4"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M260 -20C240 60 310 120 290 320"
                stroke="#E7F5E4"
                strokeWidth="20"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* TOP BUTTONS */}
          <div className="absolute left-4 top-4 z-10">
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
              <BackIcon />
            </button>
          </div>

          <div className="absolute right-4 top-4 z-10">
            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
              <HeartIcon filled />
            </button>
          </div>
        </div>

        {/* CONTENT CARD */}
        <section className="relative -mt-10 rounded-t-[34px] bg-white px-5 pb-5 pt-4">
          {/* HANDLE */}
          <div className="mx-auto mb-5 h-1.5 w-16 rounded-full bg-[#D1D5DB]" />

          {/* HEADER */}
          <div className="flex gap-4">
            {/* IMAGE */}
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl bg-gradient-to-br from-[#00F5D4] to-[#00BBF9] p-[2px]">
              <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-[#E5E7EB] text-5xl">
                📚
              </div>
            </div>

            {/* INFO */}
            <div className="flex flex-1 flex-col">
              <h1
                className="text-[28px] leading-[1] text-black"
                style={{ fontFamily: "Comic Sans MS, cursive" }}
              >
                BIBLIOTECA
                <br />
                CENTRAL
              </h1>

              <div className="mt-2 h-1 w-28 rounded-full bg-[#00F5D4]" />

              <p className="mt-3 text-[14px] leading-5 text-[#4B5563]">
                El lugar perfecto para estudiar, investigar y concentrarte.
              </p>

              <div className="mt-3 space-y-1 text-[13px] text-[#4B5563]">
                <p>🕒 Lun - Vie: 7:00 AM - 9:00 PM</p>
                <p>🕒 Sáb: 8:00 AM - 2:00 PM</p>
              </div>
            </div>
          </div>

          {/* STARS */}
          <div className="mt-5 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((star) => (
                <Star key={star} filled />
              ))}
              <Star filled={false} />
            </div>

            <span className="ml-2 text-sm font-semibold text-[#374151]">
              4.2 (128)
            </span>
          </div>

          {/* FEATURED COMMENT */}
          <div className="mt-5 rounded-[28px] border-2 border-[#9B5DE5]/40 bg-[#FAF7FF] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">📣</span>

                  <h2
                    className="text-lg text-[#7C3AED]"
                    style={{ fontFamily: "Comic Sans MS, cursive" }}
                  >
                    DESTACADO
                  </h2>
                </div>

                <p className="text-[15px] leading-6 text-[#1F2937]">
                  Aquí me siento en mi elemento 😎
                  <br />
                  Full tranquilidad y buen Wi-Fi.
                </p>

                <p className="mt-3 text-sm font-semibold text-[#7C3AED]">
                  — @estudioso_ucv
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <HeartIcon filled />
                <span className="text-lg font-semibold text-[#111827]">
                  24
                </span>
              </div>
            </div>
          </div>

          {/* COMMENTS */}
          <div className="mt-4 space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex items-start justify-between gap-3 border-b border-[#F3F4F6] pb-4"
              >
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E9D5FF] text-2xl">
                    {comment.avatar}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#7C3AED]">
                        {comment.username}
                      </span>

                      <span className="text-xs text-[#9CA3AF]">
                        • {comment.time}
                      </span>
                    </div>

                    <p className="mt-1 max-w-[210px] text-[15px] leading-6 text-[#1F2937]">
                      {comment.text}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <HeartIcon />
                  <span className="text-base text-[#111827]">
                    {comment.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex flex-1 items-center rounded-2xl border-2 border-[#E5E7EB] bg-white px-4 py-3">
              <input
                type="text"
                placeholder="Escribe tu comentario..."
                className="flex-1 bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF]"
              />

              <button className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6]">
                <SendIcon />
              </button>
            </div>

            <button className="flex h-[74px] w-[74px] flex-col items-center justify-center rounded-3xl border-2 border-[#FFE58F] bg-[#FFFBEA]">
              <Star filled />
              <span className="mt-1 text-xs font-semibold text-[#111827]">
                Puntuar
              </span>
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}