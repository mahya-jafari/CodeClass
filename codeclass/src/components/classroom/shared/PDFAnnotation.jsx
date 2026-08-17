'use client';

export default function PDFAnnotation({
  annotation,
  viewMode = false,
}) {
  return (
    <div
      className={`absolute inset-0 z-10 ${
        viewMode ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      <canvas
        ref={annotation.canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        onMouseDown={annotation.start}
        onMouseMove={annotation.move}
        onMouseUp={annotation.end}
        onMouseLeave={annotation.end}
        onClick={annotation.addText}
      />
    </div>
  );
}