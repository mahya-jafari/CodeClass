'use client';

export default function Whiteboard({ wb, canEdit = false }) {
  const { canvasRef, start, move, end, addText } = wb;

  return (
    <div className="flex-1 relative">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${canEdit ? "cursor-crosshair" : "cursor-default"}`}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onClick={addText}
      />
    </div>
  );
}
