'use client';

import {
  FiVideo, FiMaximize, FiUpload, FiPlay, FiPause,
  FiUsers, FiMic, FiMicOff, FiMoreVertical, FiSend,
} from "react-icons/fi";

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
  messages,
  message,
  setMessage,
  send,
}) {
  return (
    <aside className={`bg-white border-r flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden ${chatOpen ? "w-72 opacity-100" : "w-0 opacity-0 border-0"}`}>
      <div className="p-3 border-b flex-shrink-0">
        <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
          {videoSrc ? (
            <video ref={videoRef} src={videoSrc} className="w-full h-full object-cover" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
          ) : cameraOn ? (
            <video ref={camRef} autoPlay muted playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500"><FiVideo size={28} /></div>
          )}
          <div className="absolute bottom-1.5 left-1.5 flex gap-1">
            {videoSrc && (
              <button onClick={() => { const v = videoRef.current; v.paused ? v.play() : v.pause(); }} className="p-1.5 bg-black/60 text-white rounded-lg">
                {playing ? <FiPause size={12} /> : <FiPlay size={12} />}
              </button>
            )}
            <button onClick={() => (videoRef.current || camRef.current)?.requestFullscreen?.()} className="p-1.5 bg-black/60 text-white rounded-lg"><FiMaximize size={12} /></button>
            <label className="p-1.5 bg-black/60 text-white rounded-lg cursor-pointer">
              <FiUpload size={12} />
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setVideoSrc(URL.createObjectURL(f)); setCameraOn(false); }
                }}
              />
            </label>
          </div>
        </div>
      </div>

      {/* participants */}
      <div className="border-b flex-shrink-0">
        <div className="px-3 py-2 text-xs font-bold flex items-center gap-1.5"><FiUsers size={13} /> اعضای حاضر ({participants.length})</div>
        <div className="max-h-44 overflow-y-auto px-1.5 pb-1.5">
          {participants.map((p) => (
            <div key={p.id} className="flex items-center gap-2 px-1.5 py-1.5 rounded-lg hover:bg-gray-50">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium">{p.name[0]}</div>
              <p className="flex-1 text-[11px] font-medium truncate">{p.name}</p>
              <button onClick={() => setParticipants((ps) => ps.map((x) => x.id === p.id ? { ...x, mic: !x.mic } : x))} className={p.mic ? "text-green-600" : "text-red-400"}>
                {p.mic ? <FiMic size={12} /> : <FiMicOff size={12} />}
              </button>
              <FiMoreVertical size={12} className="text-gray-400" />
            </div>
          ))}
        </div>
      </div>

      {/* chat */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-3 py-2 border-b text-xs font-bold">گفتگو</div>
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
            placeholder="پیام..."
            className="flex-1 px-2.5 py-2 border rounded-xl text-[11px] outline-none focus:border-blue-500"
          />
          <button onClick={send} className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center"><FiSend size={13} /></button>
        </div>
      </div>
    </aside>
  );
}