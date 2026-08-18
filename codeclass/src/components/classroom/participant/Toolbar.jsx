'use client';

import { useState, useEffect, useCallback } from "react";
import {
  FiRotateCcw, FiRotateCw, FiEdit2, 
  FiCode, FiPhoneOff, FiVideo, FiFileText,
  FiMaximize, FiMinimize, FiSettings,
} from "react-icons/fi";
import { FaLaptopCode } from "react-icons/fa";

export default function Toolbar({
  wb,
  pdf,
  mode,
  setMode,
  canEdit,
  onExit,
  onOpenSettings,
  pdfViewMode,
  setPdfViewMode,
}) {
  const [fullscreen, setFullscreen] = useState(false);

  const showTools = mode === "whiteboard" || mode === "pdf";

  useEffect(() => {
    const fn = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, []);

  const toggleFullscreen = useCallback(() => {
    document.fullscreenElement
      ? document.exitFullscreen?.()
      : document.documentElement.requestFullscreen?.();
  }, []);

  const w = wb || {};
  const p = pdf || {};

  return (
    <>
      {/* Top bar */}
      <header className="h-12 bg-white border-b grid grid-cols-3 items-center px-2 md:px-3 flex-shrink-0 z-20">

        {/* Right - Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <FaLaptopCode size={22} />
          </div>
          <span className="text-xl font-bold text-gray-800">
            CodeClass
          </span>
        </div>

        {/* Center - Modes */}
        <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-xl p-1 mx-auto">

          <button
            onClick={() => setMode("media")}
            className={`md:hidden p-1.5 rounded-lg ${
              mode === "media"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600"
            }`}
          >
            <FiVideo size={12} />
          </button>

          <button
            onClick={() => setMode("whiteboard")}
            className={`flex items-center gap-1 px-2 md:px-2.5 py-1.5 rounded-lg text-xs ${
              mode === "whiteboard"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600"
            }`}
          >
            <FiEdit2 size={12} />
            <span className="hidden sm:inline">whiteboard</span>
          </button>

          <button
            onClick={() => setMode("pdf")}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs ${
              mode === "pdf"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600"
            }`}
          >
            <FiFileText size={12} />
            <span>PDF</span>
          </button>

          <button
            onClick={() => setMode("ide")}
            className={`flex items-center gap-1 px-2 md:px-2.5 py-1.5 rounded-lg text-xs ${
              mode === "ide"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600"
            }`}
          >
            <FiCode size={12} />
            <span className="hidden sm:inline">IDE</span>
          </button>
        </div>

        {/* Left - Actions */}
        <div className="flex items-center justify-end gap-1.5">

          {canEdit && showTools && (
            <>
              <button
                onClick={mode === "pdf" ? p.redo : w.redo}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="ازنو"
              >
                <FiRotateCw size={15} />
              </button>

              <button
                onClick={mode === "pdf" ? p.undo : w.undo}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                title="واگرد"
              >
                <FiRotateCcw size={15} />
              </button>

              <div className="w-px h-5 bg-gray-200" />
            </>
          )}

          <button
            onClick={toggleFullscreen}
            title={fullscreen ? "خروج از تمام‌صفحه" : "تمام‌صفحه"}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {fullscreen ? <FiMinimize size={15} /> : <FiMaximize size={15} />}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="تنظیمات"
          >
            <FiSettings size={15} />
          </button>

          <button
            onClick={onExit}
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[11px] md:text-xs"
          >
            <FiPhoneOff size={13} />
            <span className="hidden sm:inline">خروج از کلاس</span>
          </button>
        </div>
      </header>
    </>
  );
}