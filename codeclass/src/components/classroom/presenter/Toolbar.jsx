'use client';

import { useState, useEffect, useCallback } from "react";
import {
  FiRotateCcw, FiRotateCw, FiEdit2, FiSquare, FiTrash2, FiType,
  FiCircle, FiFileText, FiCode, FiSettings, FiPhoneOff, FiVideo,
  FiMaximize, FiMinimize, FiEye, FiChevronLeft, FiChevronRight, FiRefreshCw,
} from "react-icons/fi";
import { FaLaptopCode } from "react-icons/fa";

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
  onOpenSettings,
  onExit,
  zoom: zoomProp,
  onZoomChange,
  pdfViewMode,
  setPdfViewMode,
  onRemovePdf,
}) {

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const showTools = mode === "whiteboard" || mode === "pdf";

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  return (
    <>
      {/* top bar */}
      <header className="h-12 bg-white border-b grid grid-cols-3 items-center px-2 md:px-3 flex-shrink-0 z-20 gap-1">

        {/* Logo - Top right */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <FaLaptopCode size={22} />
          </div>
          <span className="text-xl font-bold text-gray-800">CodeClass</span>
        </div>

        {/* Mode switch - Center */}
        <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-xl p-1 mx-auto flex-shrink-0">
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
            <span className="hidden sm:inline">whiteboard</span>
          </button>

          <button
            onClick={() => setMode("pdf")}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${
              mode === "pdf" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"
            }`}
          >
            <FiFileText size={12} />
            <span className="hidden sm:inline">PDF</span>
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

        {/* right actions: undo/redo, fullscreen, settings, exit */}
        <div className="flex items-center justify-end gap-0.5 md:gap-1.5 flex-shrink-0">
          {showTools && (
            <>
              <button
                onClick={redo}
                title="ازنو"
                className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <FiRotateCw className="w-3.5 h-3.5 md:w-[15px] md:h-[15px]" />
              </button>
              <button
                onClick={undo}
                title="واگرد"
                className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <FiRotateCcw className="w-3.5 h-3.5 md:w-[15px] md:h-[15px]" />
              </button>
              <div className="w-px h-5 bg-gray-200 mx-0.5 flex-shrink-0" />
            </>
          )}

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه"}
            className="p-1.5 md:p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isFullscreen ? (
              <FiMinimize className="w-3.5 h-3.5 md:w-[15px] md:h-[15px]" />
            ) : (
              <FiMaximize className="w-3.5 h-3.5 md:w-[15px] md:h-[15px]" />
            )}
          </button>

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

      {/* left vertical tools panel */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 left-6 bg-gray-100 rounded-2xl flex flex-col items-center py-3 gap-1 z-20 transition-all duration-200 ${
          panelCollapsed ? "w-10" : "w-14"
        }`}
      >
        {/* collapse / expand handle */}
        <button
          onClick={() => setPanelCollapsed((c) => !c)}
          title={panelCollapsed ? "باز کردن ابزارها" : "جمع کردن ابزارها"}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg flex-shrink-0"
        >
          {panelCollapsed ? <FiChevronLeft size={15} /> : <FiChevronRight size={15} />}
        </button>

        {!panelCollapsed && (
          <>
            {showTools && (
              <>
                <div className="w-8 h-px bg-gray-200 my-1 flex-shrink-0" />

                <ToolBtn id="pen" icon={<FiEdit2 size={16} />} title="مداد" tool={tool} setTool={setTool} />
                <ToolBtn id="highlighter" icon={<FiSquare size={16} />} title="هایلایتر" tool={tool} setTool={setTool} />
                <ToolBtn id="eraser" icon={<FiTrash2 size={16} />} title="پاک‌کن" tool={tool} setTool={setTool} />
                <ToolBtn id="text" icon={<FiType size={16} />} title="متن" tool={tool} setTool={setTool} />

                {["pen", "highlighter", "text"].includes(tool) && (
                  <div className="flex flex-col items-center gap-2 mt-1 flex-shrink-0">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-7 h-7 rounded border-0 cursor-pointer flex-shrink-0"
                    />
                    <div className="h-20 w-6 flex items-center justify-center flex-shrink-0">
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={size}
                        onChange={(e) => setSize(+e.target.value)}
                        className="w-20"
                        style={{ transform: "rotate(-90deg)" }}
                      />
                    </div>
                  </div>
                )}

                <div className="w-8 h-px bg-gray-200 my-1 flex-shrink-0" />
              </>
            )}

            {mode === "pdf" && (
              <>
                <button
                  onClick={() => setPdfViewMode(!pdfViewMode)}
                  title={pdfViewMode ? "فعال کردن ابزارها" : "مشاهده و کنترل PDF"}
                  className={`p-2 rounded-lg flex-shrink-0 ${
                    pdfViewMode
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FiEye size={16} />
                </button>

                <button
                  onClick={onRemovePdf}
                  title="حذف PDF و انتخاب فایل جدید"
                  className="p-2 rounded-lg flex-shrink-0 text-red-500 hover:bg-red-50"
                >
                  <FiRefreshCw size={16} />
                </button>

                <div className="w-8 h-px bg-gray-200 my-1 flex-shrink-0" />
              </>
            )}

            <button
              onClick={toggleRec}
              title="ضبط"
              className={`p-2 rounded-lg flex-shrink-0 ${
                recording ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <FiCircle size={16} className={recording ? "fill-red-600" : ""} />
            </button>
          </>
        )}
      </div>
    </>
  );
}