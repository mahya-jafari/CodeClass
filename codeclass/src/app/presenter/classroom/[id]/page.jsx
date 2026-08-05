'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react";
import {
  FiMic, FiMicOff, FiVideo, FiVideoOff, FiMessageSquare, FiUsers, FiSend,
  FiPhoneOff, FiMoreVertical, FiType, FiEdit2, FiTrash2, FiRotateCcw, FiRotateCw,
  FiDownload, FiSettings, FiFileText, FiCode, FiUpload, FiFile, FiX, FiMaximize,
  FiPlay, FiPause, FiCircle, FiSquare
} from "react-icons/fi";

export default function PresenterClassroom() {
  const router = useRouter();
  const [mode, setMode] = useState("whiteboard");
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#2563eb");
  const [size, setSize] = useState(3);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [file, setFile] = useState("App.jsx");
  const [files, setFiles] = useState({
    "App.jsx": `import React, { useState } from 'react';\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Hello React 👋</h1>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(c => c + 1)}>Increment</button>\n    </div>\n  );\n}`,
    "Header.jsx": `export default function Header() {\n  return <header>Header</header>;\n}`,
  });
  const [messages, setMessages] = useState([
    { id: 1, name: "محیا جعفری", time: "10:30", text: "من متوجه نشدم", teacher: false },
    { id: 2, name: "استاد کیشانی", time: "10:32", text: "دوباره توضیح میدم", teacher: true },
  ]);
  const [participants, setParticipants] = useState([
    { id: 1, name: "استاد کیشانی", mic: true },
    { id: 2, name: "محیا جعفری", mic: false },
    { id: 3, name: "فاطمه قاسمی", mic: false },
    { id: 4, name: "مریم حسینی", mic: false },
  ]);

  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const camRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
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
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
    return { x: x * (c.width / r.width), y: y * (c.height / r.height) };
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
      ctx.lineCap = "round";
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
    if (drawing.current) {
      drawing.current = false;
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
    } catch {
      alert("دسترسی میکروفون داده نشد");
    }
  };

  const toggleCam = async () => {
    try {
      if (cameraOn) {
        streamRef.current?.getVideoTracks().forEach((t) => { t.stop(); streamRef.current.removeTrack(t); });
        if (camRef.current) camRef.current.srcObject = null;
        setCameraOn(false);
      } else {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn });
        streamRef.current = streamRef.current || s;
        s.getVideoTracks().forEach((t) => streamRef.current.addTrack(t));
        if (camRef.current) camRef.current.srcObject = streamRef.current;
        setCameraOn(true);
        setVideoSrc(null);
      }
    } catch {
      alert("دسترسی دوربین داده نشد");
    }
  };

  const toggleRec = async () => {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const r = new MediaRecorder(s);
      chunksRef.current = [];
      r.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      r.onstop = () => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob(chunksRef.current, { type: "video/webm" }));
        a.download = `session-${Date.now()}.webm`;
        a.click();
        s.getTracks().forEach((t) => t.stop());
      };
      recorderRef.current = r;
      r.start();
      setRecording(true);
    } catch {
      alert("ضبط لغو شد");
    }
  };

  const send = () => {
    if (!message.trim()) return;
    const t = new Date();
    setMessages((m) => [...m, {
      id: Date.now(), name: "شما",
      time: `${t.getHours()}:${String(t.getMinutes()).padStart(2, "0")}`,
      text: message, teacher: true
    }]);
    setMessage("");
  };

  const ToolBtn = ({ id, icon, title }) => (
    <button onClick={() => setTool(id)} title={title}
      className={`p-2 rounded-lg ${tool === id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}>
      {icon}
    </button>
  );

  return (
    <div className="h-screen bg-[#F0F4F8] flex flex-col overflow-hidden" dir="rtl">
      <header className="h-12 bg-white border-b flex items-center justify-between px-3 flex-shrink-0 z-20">
        <div className="flex items-center gap-0.5">
          <button onClick={undo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiRotateCcw size={15} /></button>
          <button onClick={redo} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiRotateCw size={15} /></button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <ToolBtn id="pen" icon={<FiEdit2 size={15} />} title="مداد" />
          <ToolBtn id="highlighter" icon={<FiSquare size={15} />} title="هایلایتر" />
          <ToolBtn id="eraser" icon={<FiTrash2 size={15} />} title="پاک‌کن" />
          <ToolBtn id="text" icon={<FiType size={15} />} title="متن" />
          {["pen", "highlighter", "text"].includes(tool) && (
            <div className="flex items-center gap-1 mr-1">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-6 h-6 rounded border-0 cursor-pointer" />
              <input type="range" min="1" max="12" value={size} onChange={(e) => setSize(+e.target.value)} className="w-14" />
            </div>
          )}
          <button onClick={() => { const a = document.createElement("a"); a.href = canvasRef.current.toDataURL(); a.download = "whiteboard.png"; a.click(); }} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiDownload size={15} /></button>
          <button onClick={toggleRec} className={`p-2 rounded-lg ${recording ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-100"}`}>
            <FiCircle size={15} className={recording ? "fill-red-600" : ""} />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { id: "whiteboard", label: "وایت‌برد", icon: <FiEdit2 size={12} /> },
            { id: "pdf", label: "PDF", icon: <FiFileText size={12} />, file: true },
            { id: "ide", label: "IDE", icon: <FiCode size={12} /> },
          ].map((m) =>
            m.file ? (
              <label key={m.id} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${mode === m.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"}`}>
                {m.icon} {m.label}
                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setPdfUrl(URL.createObjectURL(f)); setMode("pdf"); }
                }} />
              </label>
            ) : (
              <button key={m.id} onClick={() => setMode(m.id)} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium ${mode === m.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-600"}`}>
                {m.icon} {m.label}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setSettingsOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><FiSettings size={15} /></button>
          <button onClick={() => router.push("/presenter/dashboard")} className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-xl text-xs font-medium">
            <FiPhoneOff size={13} /> <span className="hidden sm:inline">خروج از کلاس</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className={`bg-white border-r flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden ${chatOpen ? "w-72 opacity-100" : "w-0 opacity-0 border-0"}`}>
          <div className="p-3 border-b flex-shrink-0">
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
              {videoSrc ? (
                <video ref={videoRef} src={videoSrc} className="w-full h-full object-cover" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
              ) : cameraOn ? (
                <video ref={camRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500"><FiVideo size={28} /></div>
              )}
              <div className="absolute bottom-1.5 left-1.5 flex gap-1">
                {videoSrc && (
                  <button onClick={() => { const v = videoRef.current; v.paused ? v.play() : v.pause(); }} className="p-1.5 bg-black/60 text-white rounded-lg">
                    {playing ? <FiPause size={12} /> : <FiPlay size={12} />}
                  </button>
                )}
                <button onClick={() => (videoRef.current || camRef.current)?.requestFullscreen?.()} className="p-1.5 bg-black/60 text-white rounded-lg"><FiMaximize size={12} /></button>
                <label className="p-1.5 bg-black/60 text-white rounded-lg cursor-pointer">
                  <FiUpload size={12} />
                  <input type="file" accept="video/*" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) { setVideoSrc(URL.createObjectURL(f)); setCameraOn(false); }
                  }} />
                </label>
              </div>
            </div>
          </div>

          <div className="border-b flex-shrink-0">
            <div className="px-3 py-2 text-xs font-bold flex items-center gap-1.5"><FiUsers size={13} /> اعضای حاضر ({participants.length})</div>
            <div className="max-h-44 overflow-y-auto px-1.5 pb-1.5">
              {participants.map((p) => (
                <div key={p.id} className="flex items-center gap-2 px-1.5 py-1.5 rounded-lg hover:bg-gray-50">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium">{p.name[0]}</div>
                  <p className="flex-1 text-[11px] font-medium truncate">{p.name}</p>
                  <button onClick={() => setParticipants((ps) => ps.map((x) => x.id === p.id ? { ...x, mic: !x.mic } : x))} className={p.mic ? "text-green-600" : "text-red-400"}>
                    {p.mic ? <FiMic size={12} /> : <FiMicOff size={12} />}
                  </button>
                  <FiMoreVertical size={12} className="text-gray-400" />
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
              {mode === "pdf" && (
                pdfUrl ? <iframe src={pdfUrl} className="flex-1 w-full border-0" /> : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
                    <FiUpload size={36} />
                    <p className="text-sm">PDF آپلود کنید</p>
                  </div>
                )
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

      {settingsOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSettingsOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800">تنظیمات کلاس</h3>
              <button onClick={() => setSettingsOpen(false)}><FiX size={20} /></button>
            </div>
            <div className="space-y-4 text-sm">
              <label className="flex items-center justify-between"><span>میکروفون با ورود</span><input type="checkbox" className="accent-blue-600" /></label>
              <label className="flex items-center justify-between"><span>اعلان پیام جدید</span><input type="checkbox" defaultChecked className="accent-blue-600" /></label>
              <label className="flex items-center justify-between">
                <span>کیفیت ویدیو</span>
                <select className="border rounded-lg px-2 py-1 text-xs"><option>خودکار</option><option>بالا</option><option>متوسط</option></select>
              </label>
            </div>
            <button onClick={() => setSettingsOpen(false)} className="w-full mt-6 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium">ذخیره</button>
          </div>
        </div>
      )}
    </div>
  );
}