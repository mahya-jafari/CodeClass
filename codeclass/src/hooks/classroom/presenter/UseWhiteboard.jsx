'use client';

import { useRef, useState, useEffect } from "react";

export function useWhiteboard(mode) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const history = useRef([]);
  const step = useRef(-1);
  const points = useRef([]); 
  const strokeBase = useRef(null); 

  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#2563eb");
  const [size, setSize] = useState(3);

  const save = () => {
    const c = canvasRef.current;
    if (!c) return;
    history.current = history.current.slice(0, step.current + 1);
    history.current.push(c.toDataURL());
    step.current++;
  };

  useEffect(() => {
    if (mode !== "whiteboard") return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    const resize = () => {
      const img = history.current[step.current];
      c.width = c.parentElement.clientWidth;
      c.height = c.parentElement.clientHeight;
      if (img) {
        const i = new Image();
        i.onload = () => ctx.drawImage(i, 0, 0);
        i.src = img;
      } else {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, c.width, c.height);
        save();
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [mode]);

  const pos = (e) => {
    const c = canvasRef.current;
    const r = c.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    return { x: x * (c.width / r.width), y: y * (c.height / r.height) };
  };

  const start = (e) => {
    if (!["pen", "highlighter", "eraser"].includes(tool)) return;
    drawing.current = true;
    const p = pos(e);
    last.current = p;

    if (tool === "highlighter") {
      const c = canvasRef.current;
      strokeBase.current = c.getContext("2d").getImageData(0, 0, c.width, c.height);
      points.current = [p];
    }
  };

  const move = (e) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const p = pos(e);

    if (tool === "highlighter") {
      points.current.push(p);

      const base = strokeBase.current;
      if (!base) return;

      ctx.putImageData(base, 0, 0);

      if (points.current.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points.current[0].x, points.current[0].y);
      for (let i = 1; i < points.current.length; i++) {
        ctx.lineTo(points.current[i].x, points.current[i].y);
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color + "55";
      ctx.lineWidth = size * 8;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(p.x, p.y);
      if (tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = size * 5;
        ctx.lineCap = "round";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = "round";
      }
      ctx.lineJoin = "round";
      ctx.stroke();
      last.current = p;
    }
  };

  const end = () => {
    if (drawing.current) {
      drawing.current = false;
      points.current = [];
      strokeBase.current = null;
      save();
    }
  };

  const addText = (e) => {
    if (tool !== "text") return;
    const t = prompt("متن را وارد کنید:");
    if (!t) return;
    const ctx = canvasRef.current.getContext("2d");
    const p = pos(e);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = color;
    ctx.font = `${size * 6}px sans-serif`;
    ctx.fillText(t, p.x, p.y);
    save();
  };

  const undo = () => {
    if (step.current <= 0) return;
    step.current--;
    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = history.current[step.current];
  };

  const redo = () => {
    if (step.current >= history.current.length - 1) return;
    step.current++;
    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = history.current[step.current];
  };

  return {
    canvasRef, tool, setTool, color, setColor, size, setSize,
    undo, redo, start, move, end, addText,
  };
}