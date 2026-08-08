'use client';

import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiMessageSquare } from "react-icons/fi";

export default function BottomBar({
  micOn,
  toggleMic,
  cameraOn,
  toggleCam,
  chatOpen,
  setChatOpen,
  mode,
  setMode,
}) {
  const handleChatClick = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setMode?.(mode === "media" ? "whiteboard" : "media");
    } else {
      setChatOpen?.(!chatOpen);
    }
  };

  return (
    <div className="h-14 bg-white border-t flex items-center justify-center gap-2 sm:gap-3 px-2 sm:px-3 flex-shrink-0">
      <button
        onClick={toggleMic}
        className={`flex flex-col items-center p-2 rounded-xl min-w-[48px] ${
          micOn ? "text-gray-700 hover:bg-gray-100" : "text-red-500 bg-red-50"
        }`}
      >
        {micOn ? <FiMic size={18} /> : <FiMicOff size={18} />}
        <span className="text-[9px]">میکروفون</span>
      </button>
      <button
        onClick={toggleCam}
        className={`flex flex-col items-center p-2 rounded-xl min-w-[48px] ${
          cameraOn ? "text-gray-700 hover:bg-gray-100" : "text-red-500 bg-red-50"
        }`}
      >
        {cameraOn ? <FiVideo size={18} /> : <FiVideoOff size={18} />}
        <span className="text-[9px]">دوربین</span>
      </button>
      <button
        onClick={handleChatClick}
        className={`flex flex-col items-center p-2 rounded-xl min-w-[48px] ${
          mode === "media" || chatOpen
            ? "text-blue-600 bg-blue-50"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <FiMessageSquare size={18} />
        <span className="text-[9px]">چت</span>
      </button>
    </div>
  );
}
