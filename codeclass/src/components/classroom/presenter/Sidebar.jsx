'use client';

import { useState, useRef, useEffect } from "react";
import {
  FiVideo, FiMaximize, FiUpload, FiPlay, FiPause,
  FiUsers, FiMic, FiMicOff, FiMoreVertical, FiSend,
  FiEdit2, FiEyeOff, FiUserX, FiMessageSquare
} from "react-icons/fi";

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
  messages,
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
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-3 py-2 border-b text-xs font-bold flex items-center gap-1.5"><FiMessageSquare size={15} /> گفتگو</div>
         <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {messages.map((m) => (
           <div key={m.id} className="flex gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[9px] flex-shrink-0">{m.name[0]}</div>
              <div>
                <div className="flex gap-1.5 text-[12px] mb-0.5">
                  <span className={`font-medium ${m.teacher ? "text-blue-600" : "text-gray-800"}`}>{m.name}</span>
                  <span className="text-gray-400">{m.time}</span>
                </div>
                <p className={`text-[11px] px-2.5 py-1.5 rounded-lg rounded-tr-none ${m.teacher ? "bg-blue-50 text-blue-800" : "bg-gray-50"}`}>{m.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-2.5 border-t flex gap-1.5">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="پیام خود را وارد کنید..."
            className="flex-1 px-2.5 py-2 border rounded-xl text-[11px] outline-none focus:border-blue-500"
          />
          <button onClick={send} className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center"><FiSend size={13} /></button>
        </div>
      </div>
    </aside>
  );
}
