'use client';

import { FiVideo, FiMaximize, FiUsers, FiMic, FiMicOff, FiSend } from "react-icons/fi";

export default function Sidebar({ chatOpen, media, participants, chat }) {
  const { cameraOn, camRef } = media;
  const { messages, message, setMessage, send } = chat;

  return (
    <aside
      className={`
        bg-white border-b md:border-b-0 md:border-r
        flex flex-col flex-shrink-0
        transition-all duration-300 overflow-hidden
        ${chatOpen
          ? "w-full md:w-72 h-[42vh] md:h-auto opacity-100"
          : "w-full md:w-0 h-0 md:h-auto opacity-0 md:opacity-0 border-0"
        }
      `}
    >
      {/* ویدیو */}
      <div className="p-2 md:p-3 border-b flex-shrink-0">
        <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
          {cameraOn ? (
            <video ref={camRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <FiVideo size={28} />
            </div>
          )}
          <button
            onClick={() => camRef.current?.requestFullscreen?.()}
            className="absolute bottom-1.5 left-1.5 p-1.5 bg-black/60 text-white rounded-lg"
          >
            <FiMaximize size={12} />
          </button>
        </div>
      </div>

      {/* اعضا — در موبایل فشرده‌تر */}
      <div className="border-b flex-shrink-0">
        <div className="px-3 py-1.5 md:py-2 text-xs font-bold flex items-center gap-1.5">
          <FiUsers size={13} /> اعضا ({participants.length})
        </div>
        <div className="max-h-20 md:max-h-36 overflow-y-auto px-1.5 pb-1.5">
          {participants.map((p) => (
            <div key={p.id} className="flex items-center gap-2 px-1.5 py-1 md:py-1.5 rounded-lg">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium">
                {p.name[0]}
              </div>
              <p className="flex-1 text-[11px] font-medium truncate">{p.name}</p>
              <span className={p.mic ? "text-green-600" : "text-red-400"}>
                {p.mic ? <FiMic size={12} /> : <FiMicOff size={12} />}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* گفتگو */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-3 py-1.5 md:py-2 border-b text-xs font-bold">گفتگو</div>
        <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-2 md:space-y-2.5">
          {messages.map((m) => (
            <div key={m.id} className="flex gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[9px] flex-shrink-0">
                {m.name[0]}
              </div>
              <div className="min-w-0">
                <div className="flex gap-1.5 text-[10px] mb-0.5">
                  <span className={`font-medium ${m.teacher ? "text-blue-600" : "text-gray-800"}`}>
                    {m.name}
                  </span>
                  <span className="text-gray-400">{m.time}</span>
                </div>
                <p
                  className={`text-[11px] px-2.5 py-1.5 rounded-lg rounded-tr-none ${
                    m.teacher ? "bg-blue-50 text-blue-800" : "bg-gray-50"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-2 md:p-2.5 border-t flex gap-1.5">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="پیام..."
            className="flex-1 px-2.5 py-2 border rounded-xl text-[11px] outline-none focus:border-blue-500"
          />
          <button
            onClick={send}
            className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center flex-shrink-0"
          >
            <FiSend size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
}
