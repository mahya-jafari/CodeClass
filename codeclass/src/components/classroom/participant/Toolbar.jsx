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

export default function Toolbar({ wb, mode, setMode, canEdit, onExit }) {
  const { tool, setTool, color, setColor, size, setSize, undo, redo, download } = wb;

  return (
    <header className="h-12 bg-white border-b flex items-center justify-between px-2 md:px-3 flex-shrink-0 gap-1">
      {/* tools - only when canEdit */}
      <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none min-w-0 flex-1 md:flex-none">
        {canEdit && (
          <>
            <button onClick={redo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <FiRotateCw size={15} />
            </button>
            <button onClick={undo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <FiRotateCcw size={15} />
            </button>
            <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0" />
            {TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`p-2 rounded-lg flex-shrink-0 ${
                  tool === t.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {t.icon}
              </button>
            ))}
            {["pen", "highlighter", "text"].includes(tool) && (
              <div className="flex items-center gap-1 mr-1 flex-shrink-0">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-6 h-6 rounded border-0 cursor-pointer"
                />
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={size}
                  onChange={(e) => setSize(+e.target.value)}
                  className="w-12 md:w-14"
                />
              </div>
            )}
          </>
        )}
        <button onClick={download} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0" title="ذخیره">
          <FiDownload size={15} />
        </button>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 flex-shrink-0">
        <button
          onClick={() => setMode("whiteboard")}
          className={`flex items-center gap-1 px-2 md:px-2.5 py-1.5 rounded-lg text-xs font-medium ${
            mode === "whiteboard" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
          }`}
        >
          <FiEdit2 size={12} />
          <span className="hidden sm:inline">وایت‌برد</span>
        </button>
        <button
          onClick={() => setMode("ide")}
          className={`flex items-center gap-1 px-2 md:px-2.5 py-1.5 rounded-lg text-xs font-medium ${
            mode === "ide" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
          }`}
        >
          <FiCode size={12} />
          <span className="hidden sm:inline">IDE</span>
        </button>
      </div>

      <button
        onClick={onExit}
        className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-2.5 md:px-3 py-1.5 rounded-xl text-xs font-medium flex-shrink-0"
      >
        <FiPhoneOff size={13} />
        <span className="hidden sm:inline">خروج از کلاس</span>
      </button>
    </header>
  );
}
