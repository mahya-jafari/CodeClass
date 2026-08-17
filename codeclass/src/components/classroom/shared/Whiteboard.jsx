'use client';

/**
 * shared Whiteboard for presenter and participant
 */
export default function Whiteboard({
  wb,
  canEdit = true,
  canvasRef: canvasRefProp,
  start: startProp,
  move: moveProp,
  end: endProp,
  addText: addTextProp,
}) {
  const canvasRef = wb?.canvasRef ?? canvasRefProp;
  const start = wb?.start ?? startProp;
  const move = wb?.move ?? moveProp;
  const end = wb?.end ?? endProp;
  const addText = wb?.addText ?? addTextProp;

  return (
    <div className="absolute inset-0">
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full ${
          canEdit ? "cursor-crosshair" : "cursor-default"
        }`}
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onClick={addText}
      />
    </div>
  );
}