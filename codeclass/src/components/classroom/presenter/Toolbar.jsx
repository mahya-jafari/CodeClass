'use client';

import {
  FiRotateCcw, FiRotateCw, FiEdit2, FiSquare, FiTrash2, FiType,
  FiDownload, FiCircle, FiFileText, FiCode, FiSettings, FiPhoneOff,
} from "react-icons/fi";

function ToolBtn({ id, icon, title, tool, setTool }) {
  return (
    <button
      onClick={() => setTool(id)}
      title={title}
      className={`p-2 rounded-lg ${tool === id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
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
    <header className="h-12 bg-white border-b flex items-center justify-between px-3 flex-shrink-0 z-20">
      <div className="flex items-center gap-0.5">
        <button onClick={undo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiRotateCcw size={15} /></button>
        <button onClick={redo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiRotateCw size={15} /></button>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolBtn id="pen" icon={<FiEdit2 size={15} />} title="مداد" tool={tool} setTool={setTool} />
        <ToolBtn id="highlighter" icon={<FiSquare size={15} />} title="هایلایتر" tool={tool} setTool={setTool} />
        <ToolBtn id="eraser" icon={<FiTrash2 size={15} />} title="پاک‌کن" tool={tool} setTool={setTool} />
        <ToolBtn id="text" icon={<FiType size={15} />} title="متن" tool={tool} setTool={setTool} />
        {["pen", "highlighter", "text"].includes(tool) && (
          <div className="flex items-center gap-1 mr-1">
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-6 h-6 rounded border-0 cursor-pointer" />
            <input type="range" min="1" max="12" value={size} onChange={(e) => setSize(+e.target.value)} className="w-14" />
          </div>
        )}
        <button
          onClick={() => { const a = document.createElement("a"); a.href = canvasRef.current.toDataURL(); a.download = "whiteboard.png"; a.click(); }}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <FiDownload size={15} />
        </button>
        <button onClick={toggleRec} className={`p-2 rounded-lg ${recording ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-100"}`}>
          <FiCircle size={15} className={recording ? "fill-red-600" : ""} />
        </button>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
        {[
          { id: "whiteboard", label: "وایت‌برد", icon: <FiEdit2 size={12} /> },
          { id: "pdf", label: "PDF", icon: <FiFileText size={12} />, file: true },
          { id: "ide", label: "IDE", icon: <FiCode size={12} /> },
        ].map((m) =>
          m.file ? (
            <label key={m.id} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${mode === m.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"}`}>
              {m.icon} {m.label}
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setPdfUrl(URL.createObjectURL(f)); setMode("pdf"); }
                }}
              />
            </label>
          ) : (
            <button key={m.id} onClick={() => setMode(m.id)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${mode === m.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"}`}>
              {m.icon} {m.label}
            </button>
          )
        )}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={onOpenSettings} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiSettings size={15} /></button>
        <button onClick={onExit} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-medium">
          <FiPhoneOff size={13} /> <span className="hidden sm:inline">خروج از کلاس</span>
        </button>
      </div>
    </header>
  );
}