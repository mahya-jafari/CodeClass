'use client';

import { useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";

export function useWhiteboard(mode, canEdit = true) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const history = useRef([]);
  const step = useRef(-1);

  const [pages, setPages] = useState([null]);
  const [page, setPage] = useState(0);

  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#2563eb");
  const [size, setSize] = useState(3);

  const canvas = () => canvasRef.current;

  const draw = (src) => {
    const c = canvas();
    if (!c) return;

    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    if (!src) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, c.width, c.height);
      return;
    }

    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0, c.width, c.height);
    img.src = src;
  };

  const save = () => {
    const c = canvas();
    if (!c) return;

    history.current = history.current.slice(0, step.current + 1);
    history.current.push(c.toDataURL("image/png"));
    step.current++;

    setPages((p) => {
      const next = [...p];
      next[page] = history.current[step.current];
      return next;
    });
  };

  useEffect(() => {
    if (mode !== "whiteboard") return;

    const c = canvas();
    if (!c) return;

    c.width = c.parentElement.clientWidth;
    c.height = c.parentElement.clientHeight;

    history.current = pages[page] ? [pages[page]] : [];
    step.current = pages[page] ? 0 : -1;

    draw(pages[page]);

    if (!pages[page]) save();
  }, [mode, page]);

  const pos = (e) => {
    const c = canvas();
    const r = c.getBoundingClientRect();

    return {
      x: (e.clientX - r.left) * (c.width / r.width),
      y: (e.clientY - r.top) * (c.height / r.height),
    };
  };

  const start = (e) => {
    if (!canEdit || !["pen", "eraser", "highlighter"].includes(tool)) return;

    drawing.current = true;
    last.current = pos(e);
  };

  const move = (e) => {
    if (!drawing.current) return;

    const c = canvas();
    const ctx = c.getContext("2d");
    const p = pos(e);

    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);

    ctx.globalCompositeOperation =
      tool === "eraser" ? "destination-out" : "source-over";

    ctx.strokeStyle =
      tool === "highlighter" ? color + "55" : color;

    ctx.lineWidth =
      tool === "eraser" ? Math.max(size * 5, 25) :
      tool === "highlighter" ? size * 8 : size;

    ctx.lineCap = "round";
    ctx.stroke();

    last.current = p;
  };

  const end = () => {
    if (!drawing.current) return;
    drawing.current = false;
    save();
  };

  const addText = (e) => {
    if (!canEdit || tool !== "text") return;

    const text = prompt("متن را وارد کنید:");
    if (!text) return;

    const c = canvas();
    const ctx = c.getContext("2d");
    const p = pos(e);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = color;
    ctx.font = `${size * 6}px sans-serif`;
    ctx.fillText(text, p.x, p.y);

    save();
  };

  const undo = () => {
    if (step.current <= 0) return;

    step.current--;
    draw(history.current[step.current]);
  };

  const redo = () => {
    if (step.current >= history.current.length - 1) return;

    step.current++;
    draw(history.current[step.current]);
  };

  const addPage = () => {
    save();

    setPages((p) => [...p, null]);
    setPage(pages.length);
  };

  const deletePage = () => {
    if (pages.length === 1) return;

    setPages((p) => p.filter((_, i) => i !== page));
    setPage((p) => Math.max(0, Math.min(p, pages.length - 2)));
  };

  const nextPage = () => {
    if (page < pages.length - 1) {
      save();
      setPage((p) => p + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      save();
      setPage((p) => p - 1);
    }
  };

  const downloadPDF = () => {
    save();

    setTimeout(() => {
      const pdf = new jsPDF("landscape", "px", [
        canvas().width,
        canvas().height,
      ]);

      pages.forEach((image, i) => {
        if (!image) return;

        if (i > 0) {
          pdf.addPage([canvas().width, canvas().height], "landscape");
        }

        pdf.addImage(
          image,
          "PNG",
          0,
          0,
          canvas().width,
          canvas().height
        );
      });

      pdf.save("whiteboard.pdf");
    }, 100);
  };

  return {
    canvasRef,
    tool, setTool,
    color, setColor,
    size, setSize,
    undo, redo,
    start, move, end, addText,

    page,
    pages,
    addPage,
    deletePage,
    nextPage,
    prevPage,
    downloadPDF,
  };
}