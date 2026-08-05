'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import {
  FiMic, FiMicOff, FiVideo, FiVideoOff, FiMessageSquare, FiUsers, FiSend,
  FiPhoneOff, FiType, FiEdit2, FiTrash2, FiRotateCcw, FiRotateCw,
  FiDownload, FiFileText, FiCode, FiFile, FiX, FiMaximize, FiSquare
} from "react-icons/fi";

export default function ParticipantClassroom() {
  const router = useRouter();
  const [mode, setMode] = useState("whiteboard");
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#2563eb");
  const [size, setSize] = useState(3);
  const [file, setFile] = useState("App.jsx");
  const [files, setFiles] = useState({
    "App.jsx": `import React, { useState } from 'react';\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Hello React 👋</h1>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(c => c + 1)}>Increment</button>\n    </div>\n  );\n}`,
  });
  const [messages, setMessages] = useState([
    { id: 1, name: "استاد کیشانی", time: "10:32", text: "کسی سوالی داره؟", teacher: true },
  ]);
  const participants = [
    { id: 1, name: "استاد کیشانی", mic: true },
    { id: 2, name: "شما", mic: false },
    { id: 3, name: "محیا جعفری", mic: false },
  ];

  const canvasRef = useRef(null);
  const camRef = useRef(null);
  const streamRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const history = useRef([]);
  const step = useRef(-1);

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
    const x = (e.clientX - r.left) * (c.width / r.width);
    const y = (e.clientY - r.top) * (c.height / r.height);
    return { x, y };
  };

  const start = (e) => {
    if (!["pen", "highlighter", "eraser"].includes(tool)) return;
    drawing.current = true;
    last.current = pos(e);
  };

  const move = (e) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current.getContext("2d");
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    if (tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = size * 5;
    } else if (tool === "highlighter") {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color + "55";
      ctx.lineWidth = size * 8;
      ctx.lineCap = "square";
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.lineCap = "round";
    }
    ctx.lineJoin = "round";
    ctx.stroke();
    last.current = p;
  };

  const end = () => {
    if (drawing.current) { drawing.current = false; save(); }
  };

  const addText = (e) => {
    if (tool !== "text") return;
    const t = prompt("متن:");
    if (!t) return;
    const ctx = canvasRef.current.getContext("2d");
    const p = pos(e);
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

  const toggleMic = async () => {
    try {
      if (micOn) {
        streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = false));
        setMicOn(false);
      } else {
        if (!streamRef.current) streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: cameraOn });
        streamRef.current.getAudioTracks().forEach((t) => (t.enabled = true));
        setMicOn(true);
      }
    } catch { alert("دسترسی میکروفون داده نشد"); }
  };

  const toggleCam = async () => {
    try {
      if (cameraOn) {
        streamRef.current?.getVideoTracks().forEach((t) => { t.stop(); streamRef.current?.removeTrack(t); });
        if (camRef.current) camRef.current.srcObject = null;
        setCameraOn(false);
      } else {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn });
        streamRef.current = streamRef.current || s;
        s.getVideoTracks().forEach((t) => streamRef.current.addTrack(t));
        if (camRef.current) camRef.current.srcObject = streamRef.current;
        setCameraOn(true);
      }
    } catch { alert("دسترسی دوربین داده نشد"); }
  };

  const send = () => {
    if (!message.trim()) return;
    const t = new Date();
    setMessages((m) => [...m, {
      id: Date.now(), name: "شما",
      time: `${t.getHours()}:${String(t.getMinutes()).padStart(2, "0")}`,
      text: message, teacher: false
    }]);
    setMessage("");
  };

  return (
    <div className="h-screen bg-[#F0F4F8] flex flex-col overflow-hidden" dir="rtl">
      <header className="h-12 bg-white border-b flex items-center justify-between px-3 flex-shrink-0">
        <div className="flex items-center gap-0.5">
          <button onClick={undo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiRotateCcw size={15} /></button>
          <button onClick={redo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiRotateCw size={15} /></button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          {[
            { id: "pen", icon: <FiEdit2 size={15} /> },
            { id: "highlighter", icon: <FiSquare size={15} /> },
            { id: "eraser", icon: <FiTrash2 size={15} /> },
            { id: "text", icon: <FiType size={15} /> },
          ].map((t) => (
            <button key={t.id} onClick={() => setTool(t.id)}
              className={`p-2 rounded-lg ${tool === t.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}>
              {t.icon}
            </button>
          ))}
          {["pen", "highlighter", "text"].includes(tool) && (
            <div className="flex items-center gap-1 mr-1">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-6 h-6 rounded border-0 cursor-pointer" />
              <input type="range" min="1" max="12" value={size} onChange={(e) => setSize(+e.target.value)} className="w-14" />
            </div>
          )}
          <button onClick={() => { const a = document.createElement("a"); a.href = canvasRef.current.toDataURL(); a.download = "board.png"; a.click(); }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiDownload size={15} /></button>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <button onClick={() => setMode("whiteboard")} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${mode === "whiteboard" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"}`}>
            <FiEdit2 size={12} /> وایت‌برد
          </button>
          <button onClick={() => setMode("ide")} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${mode === "ide" ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"}`}>
            <FiCode size={12} /> IDE
          </button>
        </div>

        <button onClick={() => router.push("/participant/dashboard")} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-medium">
          <FiPhoneOff size={13} /> <span className="hidden sm:inline">خروج از کلاس</span>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className={`bg-white border-r flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden ${chatOpen ? "w-72 opacity-100" : "w-0 opacity-0 border-0"}`}>
          <div className="p-3 border-b flex-shrink-0">
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
              {cameraOn ? (
                <video ref={camRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500"><FiVideo size={28} /></div>
              )}
              <button onClick={() => camRef.current?.requestFullscreen?.()} className="absolute bottom-1.5 left-1.5 p-1.5 bg-black/60 text-white rounded-lg">
                <FiMaximize size={12} />
              </button>
            </div>
          </div>

          <div className="border-b flex-shrink-0">
            <div className="px-3 py-2 text-xs font-bold flex items-center gap-1.5"><FiUsers size={13} /> اعضا ({participants.length})</div>
            <div className="max-h-36 overflow-y-auto px-1.5 pb-1.5">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center gap-2 px-1.5 py-1.5 rounded-lg">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium">{p.name[0]}</div>
                  <p className="flex-1 text-[11px] font-medium truncate">{p.name}</p>
                  <span className={p.mic ? "text-green-600" : "text-red-400"}>
                    {p.mic ? <FiMic size={12} /> : <FiMicOff size={12} />}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-3 py-2 border-b text-xs font-bold">گفتگو</div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {messages.map((m) => (
                <div key={m.id} className="flex gap-1.5">
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[9px] flex-shrink-0">{m.name[0]}</div>
                  <div>
                    <div className="flex gap-1.5 text-[10px] mb-0.5">
                      <span className={`font-medium ${m.teacher ? "text-blue-600" : "text-gray-800"}`}>{m.name}</span>
                      <span className="text-gray-400">{m.time}</span>
                    </div>
                    <p className={`text-[11px] px-2.5 py-1.5 rounded-lg rounded-tr-none ${m.teacher ? "bg-blue-50 text-blue-800" : "bg-gray-50"}`}>{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-2.5 border-t flex gap-1.5">
              <input value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="پیام..." className="flex-1 px-2.5 py-2 border rounded-xl text-[11px] outline-none focus:border-blue-500" />
              <button onClick={send} className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center"><FiSend size={13} /></button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 p-3 overflow-hidden">
            <div className="h-full bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col">
              {mode === "whiteboard" && (
                <div className="flex-1 relative">
                  <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair"
                    onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end} onClick={addText} />
                </div>
              )}
              {mode === "ide" && (
                <div className="flex-1 flex overflow-hidden" dir="ltr">
                  <div className="w-40 bg-[#1e1e1e] text-gray-300 flex flex-col border-r border-gray-700">
                    <div className="px-2 py-1.5 text-[10px] text-gray-500 border-b border-gray-700">EXPLORER</div>
                    {Object.keys(files).map((f) => (
                      <button key={f} onClick={() => setFile(f)} className={`flex items-center gap-1 px-2 py-1 text-[11px] text-left ${file === f ? "bg-[#37373d] text-white" : "hover:bg-[#2a2a2a]"}`}>
                        <FiFile size={11} className="text-blue-400" /> {f}
                      </button>
                    ))}
                  </div>
                  <div className="flex-1">
                    <Editor height="100%" theme="vs-dark" language="javascript" value={files[file]}
                      onChange={(v) => setFiles((p) => ({ ...p, [file]: v || "" }))}
                      options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="h-14 bg-white border-t flex items-center justify-center gap-3 px-3 flex-shrink-0">
            <button onClick={toggleMic} className={`flex flex-col items-center p-2 rounded-xl min-w-[48px] ${micOn ? "text-gray-700 hover:bg-gray-100" : "text-red-500 bg-red-50"}`}>
              {micOn ? <FiMic size={18} /> : <FiMicOff size={18} />}
              <span className="text-[9px]">میکروفون</span>
            </button>
            <button onClick={toggleCam} className={`flex flex-col items-center p-2 rounded-xl min-w-[48px] ${cameraOn ? "text-gray-700 hover:bg-gray-100" : "text-red-500 bg-red-50"}`}>
              {cameraOn ? <FiVideo size={18} /> : <FiVideoOff size={18} />}
              <span className="text-[9px]">دوربین</span>
            </button>
            <button onClick={() => setChatOpen(!chatOpen)} className={`flex flex-col items-center p-2 rounded-xl min-w-[48px] ${chatOpen ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-100"}`}>
              <FiMessageSquare size={18} />
              <span className="text-[9px]">چت</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}