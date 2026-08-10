'use client';

import {
  FiRotateCcw, FiRotateCw, FiEdit2, FiSquare, FiTrash2, FiType,
  FiDownload, FiCircle, FiFileText, FiCode, FiSettings, FiPhoneOff, FiVideo,
} from "react-icons/fi";

function ToolBtn({ id, icon, title, tool, setTool }) {
  return (
    <button
      onClick={() => setTool(id)}
      title={title}
      className={`p-2 rounded-lg flex-shrink-0 ${
        tool === id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon}
    </button>
  );
}

export default function Toolbar({
  undo,
  redo,
  tool,
  setTool,
  color,
  setColor,
  size,
  setSize,
  canvasRef,
  recording,
  toggleRec,
  mode,
  setMode,
  setPdfUrl,
  onOpenSettings,
  onExit,
}) {
  return (
    <header className="h-12 bg-white border-b flex items-center justify-between px-2 md:px-3 flex-shrink-0 z-20 gap-1">
      {/* tools */}
      <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-none min-w-0 flex-1 md:flex-none">
        {mode === "whiteboard" && (
          <>
            <button onClick={undo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <FiRotateCcw size={15} />
            </button>
            <button onClick={redo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <FiRotateCw size={15} />
            </button>
            <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0" />
            <ToolBtn id="pen" icon={<FiEdit2 size={15} />} title="مداد" tool={tool} setTool={setTool} />
            <ToolBtn id="highlighter" icon={<FiSquare size={15} />} title="هایلایتر" tool={tool} setTool={setTool} />
            <ToolBtn id="eraser" icon={<FiTrash2 size={15} />} title="پاک‌کن" tool={tool} setTool={setTool} />
            <ToolBtn id="text" icon={<FiType size={15} />} title="متن" tool={tool} setTool={setTool} />
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
            <button
              onClick={() => {
                if (!canvasRef.current) return;
                const a = document.createElement("a");
                a.href = canvasRef.current.toDataURL();
                a.download = "whiteboard.png";
                a.click();
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0"
            >
              <FiDownload size={15} />
            </button>
          </>
        )}
        <button
          onClick={toggleRec}
          className={`p-2 rounded-lg flex-shrink-0 ${
            recording ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <FiCircle size={15} className={recording ? "fill-red-600" : ""} />
        </button>
      </div>

      {/* Mode switch */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 flex-shrink-0">
        <button
          onClick={() => setMode("media")}
          className={`md:hidden flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium ${
            mode === "media" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
          }`}
        >
          <FiVideo size={12} />
        </button>
        <button
          onClick={() => setMode("whiteboard")}
          className={`flex items-center gap-1 px-2 md:px-2.5 py-1.5 rounded-lg text-xs font-medium ${
            mode === "whiteboard" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
          }`}
        >
          <FiEdit2 size={12} />
          <span className="hidden sm:inline">وایت‌برد</span>
        </button>
        <label
          className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
            mode === "pdf" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
          }`}
        >
          <FiFileText size={12} />
          <span className="hidden sm:inline">PDF</span>
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                setPdfUrl(URL.createObjectURL(f));
                setMode("pdf");
              }
            }}
          />
        </label>
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

      {/* right actions — smaller on mobile */}
      <div className="flex items-center gap-0.5 md:gap-2 flex-shrink-0">
        <button
          onClick={onOpenSettings}
          className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <FiSettings className="w-3.5 h-3.5 md:w-[15px] md:h-[15px]" />
        </button>
        <button
          onClick={onExit}
          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[11px] md:text-xs font-medium"
        >
          <FiPhoneOff className="w-3 h-3 md:w-[13px] md:h-[13px]" />
          <span className="hidden sm:inline">خروج از کلاس</span>
        </button>
      </div>
    </header>
  );
}