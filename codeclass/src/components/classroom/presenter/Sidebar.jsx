'use client';

import { useState, useRef, useEffect } from "react";
import {
  FiVideo, FiMaximize, FiUpload, FiPlay, FiPause,
  FiUsers, FiMic, FiMicOff, FiMoreVertical, FiSend,
  FiEdit2, FiEyeOff, FiUserX, FiMessageSquare
} from "react-icons/fi";

const AVATAR_COLORS = [
  "bg-violet-500", "bg-blue-500", "bg-emerald-500", "bg-amber-500",
  "bg-pink-500", "bg-cyan-500", "bg-orange-500", "bg-fuchsia-500",
];

function avatarColor(name = "") {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function ParticipantMenu({ participant, onGrant, onRevoke, onKick, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute left-0 top-full mt-1 z-30 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 text-[11px]"
      dir="rtl"
    >
      {!participant.canEdit ? (
        <button
          onClick={() => { onGrant(); onClose(); }}
          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-green-50 text-green-700 text-right"
        >
          <FiEdit2 size={13} />
          اعطای دسترسی 
        </button>
      ) : (
        <button
          onClick={() => { onRevoke(); onClose(); }}
          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-amber-50 text-amber-700 text-right"
        >
          <FiEyeOff size={13} />
          سلب دسترسی 
        </button>
      )}
      <div className="border-t border-gray-100 my-1" />
      <button
        onClick={() => { onKick(); onClose(); }}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-600 text-right"
      >
        <FiUserX size={13} />
        خارج کردن از کلاس
      </button>
    </div>
  );
}

export default function Sidebar({
  chatOpen,
  videoSrc,
  setVideoSrc,
  videoRef,
  playing,
  setPlaying,
  cameraOn,
  setCameraOn,
  camRef,
  participants,
  setParticipants,
  toggleParticipantEdit,
  kickParticipant,
  messages = [],
  message,
  setMessage,
  send,
  fullHeight = false,
  compact = false,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  if (!fullHeight && !chatOpen) {
    return (
      <aside className="hidden md:block w-0 opacity-0 overflow-hidden border-0 transition-all duration-300" />
    );
  }

  return (
    <aside
      className={`
        bg-white flex flex-col flex-shrink-0 overflow-hidden
        ${fullHeight
          ? "w-full h-full border-0"
          : "hidden md:flex border-r w-72 h-full"
        }
      `}
    >
      {/* video */}
      <div className={`border-b flex-shrink-0 ${compact || fullHeight ? "p-2" : "p-3"}`}>
        <div
          className={`relative bg-gray-900 rounded-xl overflow-hidden mx-auto ${
            fullHeight || compact
              ? "w-full max-w-[280px] aspect-video"
              : "aspect-video w-full"
          }`}
        >
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full h-full object-cover"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          ) : cameraOn ? (
            <video ref={camRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <FiVideo size={fullHeight ? 20 : 28} />
            </div>
          )}
          <div className="absolute bottom-1 left-1 flex gap-1">
            {videoSrc && (
              <button
                onClick={() => {
                  const v = videoRef.current;
                  v.paused ? v.play() : v.pause();
                }}
                className="p-1 bg-black/60 text-white rounded-lg"
              >
                {playing ? <FiPause size={11} /> : <FiPlay size={11} />}
              </button>
            )}
            <button
              onClick={() => (videoRef.current || camRef.current)?.requestFullscreen?.()}
              className="p-1 bg-black/60 text-white rounded-lg"
            >
              <FiMaximize size={11} />
            </button>
            <label className="p-1 bg-black/60 text-white rounded-lg cursor-pointer">
              <FiUpload size={11} />
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setVideoSrc(URL.createObjectURL(f));
                    setCameraOn(false);
                  }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* participants */}
      <div className="border-b flex-shrink-0">
        <div className="px-3 py-2 text-xs font-bold flex items-center gap-1.5">
          <FiUsers size={15} /> اعضای حاضر ({participants.length})
        </div>
        <div className="max-h-44 overflow-y-auto px-1.5 pb-1.5">
          {participants.map((p) => (
            <div key={p.id} className="flex items-center gap-2 px-1.5 py-1.5 rounded-lg hover:bg-gray-50">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium">
                {p.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium truncate">{p.name}</p>
                {!p.isSelf && (
                  <p className={`text-[10px] ${p.canEdit ? "text-green-600" : "text-gray-400"}`}>
                    {p.canEdit ? "دسترسی نوشتن" : "فقط مشاهده"}
                  </p>
                )}
              </div>
              <button
                onClick={() =>
                  setParticipants((ps) =>
                    ps.map((x) => (x.id === p.id ? { ...x, mic: !x.mic } : x))
                  )
                }
                className={p.mic ? "text-green-600" : "text-red-400"}
                title={p.mic ? "قطع میک" : "وصل میک"}
              >
                {p.mic ? <FiMic size={14} /> : <FiMicOff size={14} />}
              </button>
              {!p.isSelf && (
                <div className="relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <FiMoreVertical size={14} />
                  </button>
                  {openMenuId === p.id && (
                    <ParticipantMenu
                      participant={p}
                      onGrant={() => toggleParticipantEdit?.(p.id, true)}
                      onRevoke={() => toggleParticipantEdit?.(p.id, false)}
                      onKick={() => kickParticipant?.(p.id)}
                      onClose={() => setOpenMenuId(null)}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* chat */}
      <div className="flex-1 flex flex-col min-h-0 bg-white">
        <div className="px-3 py-2 border-b flex items-center gap-1.5 flex-shrink-0">
          <div className="rounded-lg text-black-600 flex items-center justify-center">
            <FiMessageSquare size={15} />
          </div>
          <span className="text-xs font-bold text-gray-800">گفتگو</span>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3.5 bg-gray-50/60">
          {messages.map((m) => (
            <div key={m.id} className="flex gap-2 items-start">
              <div className={`w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 `}>
                {m.name[0]}
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-[11.5px] font-semibold ${m.teacher ? "text-blue-600" : "text-gray-800"}`}>
                    {m.name}
                  </span>
                  <span className="text-[10px] text-gray-400">{m.time}</span>
                </div>
                <p
                  className={`text-[12px] leading-relaxed px-3 py-2 rounded-2xl rounded-tr-sm max-w-[210px] break-words ${
                    m.teacher
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                      : "bg-white text-gray-700 border border-gray-100 shadow-sm"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t bg-white flex-shrink-0">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-1.5 focus-within:border-blue-400 focus-within:bg-white transition">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="پیام خود را بنویسید..."
              className="flex-1 bg-transparent py-1.5 text-[12px] outline-none placeholder:text-gray-500"
            />
            <button
              onClick={send}
              disabled={!message?.trim()}
              className="w-8 h-8 flex-shrink-0 bg-blue-600 hover:bg-blue-600 disabled:opacity-70 disabled:hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition"
            >
              <FiSend size={13} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}