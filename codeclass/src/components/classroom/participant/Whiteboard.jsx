'use client';

export default function Whiteboard({ wb }) {
  const { canvasRef, start, move, end, addText } = wb;

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