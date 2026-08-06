'use client';

import {
  FiRotateCcw, FiRotateCw, FiEdit2, FiSquare, FiTrash2, FiType,
  FiDownload, FiCode, FiPhoneOff,
} from "react-icons/fi";

const TOOLS = [
  { id: "pen", icon: <FiEdit2 size={15} /> },
  { id: "highlighter", icon: <FiSquare size={15} /> },
  { id: "eraser", icon: <FiTrash2 size={15} /> },
  { id: "text", icon: <FiType size={15} /> },
];

export default function Toolbar({ wb, mode, setMode, onExit }) {
  const { tool, setTool, color, setColor, size, setSize, undo, redo, download } = wb;

  return (
    <header className="h-12 bg-white border-b flex items-center justify-between px-3 flex-shrink-0">
      <div className="flex items-center gap-0.5">
        <button onClick={undo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiRotateCcw size={15} /></button>
        <button onClick={redo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiRotateCw size={15} /></button>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        {TOOLS.map((t) => (
          <button key={t.id} onClick={() => setTool(t.id)}
            className={`p-2 rounded-lg ${tool === t.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}>
            {t.icon}
          </button>
        ))}
        {["pen", "highlighter", "text"].includes(tool) && (
          <div className="flex items-center gap-1 mr-1">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-6 h-6 rounded border-0 cursor-pointer" />
            <input type="range" min="1" max="12" value={size} onChange={(e) => setSize(+e.target.value)} className="w-14" />
          </div>
        )}
        <button onClick={download} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiDownload size={15} /></button>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        <button onClick={() => setMode("whiteboard")} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${mode === "whiteboard" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"}`}>
          <FiEdit2 size={12} /> وایت‌برد
        </button>
        <button onClick={() => setMode("ide")} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${mode === "ide" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"}`}>
          <FiCode size={12} /> IDE
        </button>
      </div>

      <button onClick={onExit} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-medium">
        <FiPhoneOff size={13} /> <span className="hidden sm:inline">خروج از کلاس</span>
      </button>
    </header>
  );
}