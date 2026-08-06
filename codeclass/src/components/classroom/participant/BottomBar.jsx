'use client';

import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiMessageSquare } from "react-icons/fi";

export default function BottomBar({ media, chatOpen, setChatOpen }) {
  const { micOn, cameraOn, toggleMic, toggleCam } = media;

  return (
    <div className="h-14 bg-white border-t flex items-center justify-center gap-3 px-3 flex-shrink-0">
      <button onClick={toggleMic} className={`flex flex-col items-center p-2 rounded-xl min-w-[48px] ${micOn ? "text-gray-700 hover:bg-gray-100" : "text-red-500 bg-red-50"}`}>
        {micOn ? <FiMic size={18} /> : <FiMicOff size={18} />}
        <span className="text-[9px]">میکروفون</span>
      </button>
      <button onClick={toggleCam} className={`flex flex-col items-center p-2 rounded-xl min-w-[48px] ${cameraOn ? "text-gray-700 hover:bg-gray-100" : "text-red-500 bg-red-50"}`}>
        {cameraOn ? <FiVideo size={18} /> : <FiVideoOff size={18} />}
        <span className="text-[9px]">دوربین</span>
      </button>
      <button onClick={() => setChatOpen(!chatOpen)} className={`flex flex-col items-center p-2 rounded-xl min-w-[48px] ${chatOpen ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-100"}`}>
        <FiMessageSquare size={18} />
        <span className="text-[9px]">چت</span>
      </button>
    </div>
  );
}