'use client';

export default function Whiteboard({ canvasRef, start, move, end, addText }) {
  return (
    <div className="flex-1 relative">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onClick={addText}
      />
    </div>
  );
}