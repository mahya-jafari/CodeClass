'use client';

import { useRef, useEffect } from "react";
import { FiX, FiMove } from "react-icons/fi";

/**
 * Text Box Layer — Placed over the whiteboard and PDF
 */

export default function TextBoxLayer({
  boxes,
  selectedId,
  setSelectedId,
  updateBox,
  removeBox,
  addBox,
  tool,
  color,
  size,
  enabled = true,
}) {
  const layerRef = useRef(null);
  const dragRef = useRef(null);

  const onAddClick = (e) => {
    if (!enabled || tool !== "text") return;
    if (e.target.closest("[data-textbox]")) return;

    const rect = layerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addBox(x, y, color, Math.max(14, size * 6));
  };

  useEffect(() => {
    const onMove = (e) => {
      const d = dragRef.current;
      if (!d || !layerRef.current) return;
      const rect = layerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (d.mode === "move") {
        updateBox(d.id, {
          x: Math.max(0, x - d.ox),
          y: Math.max(0, y - d.oy),
        });
      } else if (d.mode === "resize") {
        updateBox(d.id, {
          width: Math.max(80, x - d.startX),
          height: Math.max(32, y - d.startY),
        });
      }
    };
    const onUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [updateBox]);

  if (!enabled) return null;

  return (
    <div ref={layerRef} className="absolute inset-0 z-10 pointer-events-none">
      {/* فقط وقتی ابزار متن فعال است: لایه شفاف برای ساخت باکس */}
      {tool === "text" && (
        <div
          className="absolute inset-0 cursor-text pointer-events-auto"
          onMouseDown={onAddClick}
        />
      )}

      {boxes.map((box) => {
        const selected = box.id === selectedId;
        return (
          <div
            key={box.id}
            data-textbox
            className={`absolute pointer-events-auto group ${
              selected ? "ring-2 ring-blue-500" : "ring-1 ring-transparent hover:ring-blue-300"
            }`}
            style={{
              left: box.x,
              top: box.y,
              width: box.width,
              minHeight: box.height,
              zIndex: selected ? 20 : 15,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setSelectedId(box.id);
            }}
          >
            {selected && (
              <div className="absolute -top-8 right-0 flex items-center gap-0.5 bg-white border shadow-sm rounded-lg px-1 py-0.5 z-20">
                <button
                  type="button"
                  title="جابه‌جایی"
                  className="p-1 text-gray-500 hover:text-blue-600 cursor-grab active:cursor-grabbing"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const rect = layerRef.current.getBoundingClientRect();
                    dragRef.current = {
                      id: box.id,
                      mode: "move",
                      ox: e.clientX - rect.left - box.x,
                      oy: e.clientY - rect.top - box.y,
                    };
                  }}
                >
                  <FiMove size={13} />
                </button>
                <input
                  type="range"
                  min="12"
                  max="48"
                  value={box.fontSize}
                  title="اندازه فونت"
                  className="w-14"
                  onChange={(e) => updateBox(box.id, { fontSize: +e.target.value })}
                  onMouseDown={(e) => e.stopPropagation()}
                />
                <button
                  type="button"
                  title="حذف"
                  className="p-1 text-gray-500 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBox(box.id);
                  }}
                >
                  <FiX size={14} />
                </button>
              </div>
            )}

            <textarea
              value={box.text}
              placeholder="متن را بنویسید..."
              autoFocus={selected && !box.text}
              className="w-full h-full min-h-[32px] bg-white/90 border-0 outline-none resize-none p-1.5 rounded-md shadow-sm"
              style={{
                color: box.color,
                fontSize: box.fontSize,
                lineHeight: 1.4,
              }}
              onChange={(e) => updateBox(box.id, { text: e.target.value })}
              onFocus={() => setSelectedId(box.id)}
              onMouseDown={(e) => e.stopPropagation()}
            />

            {selected && (
              <div
                className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 rounded-sm cursor-nesw-resize translate-y-1/2 -translate-x-1/2"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dragRef.current = {
                    id: box.id,
                    mode: "resize",
                    startX: box.x,
                    startY: box.y,
                  };
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
