'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUpload, FiFileText, FiX } from "react-icons/fi";

import ConfirmModal from "@/components/ui/ConfirmModal";
import Toolbar from "./components/Toolbar";
import Whiteboard from "./components/Whiteboard";
import IDEPanel from "./components/IDEPanel";
import Sidebar from "./components/Sidebar";
import BottomBar from "./components/BottomBar";
import SettingsModal from "./components/SettingsModal";

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

  const [fileModal, setFileModal] = useState(null); 
  const [newFileOpen, setNewFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
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
  const points = useRef([]); 
  const strokeBase = useRef(null); 

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
      // ذخیره پیکسل‌های فعلی بوم (sync) برای بازگردانی بدون تیرگی
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

      // بازگرداندن بوم به حالت قبل از این stroke (بدون async)
      ctx.putImageData(base, 0, 0);

      // کشیدن کل مسیر هایلایتر با شفافیت یکنواخت (بدون تیرگی وسط)
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
      // قلم و پاک‌کن مثل قبل
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

  // --- IDE helpers ---
  const getLang = (name) => {
    const ext = name.split(".").pop()?.toLowerCase();
    const map = {
      js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript",
      css: "css", scss: "scss", html: "html", json: "json", md: "markdown",
      py: "python", java: "java", c: "c", cpp: "cpp", go: "go", rs: "rust",
    };
    return map[ext] || "javascript";
  };

  const addFile = () => {
  setNewFileName("");
  setNewFileOpen(true);        
    };

const createNewFile = () => {
  const n = newFileName.trim();
  if (!n) return;

  if (files[n]) {
    setNewFileOpen(false);
    setFileModal({ type: "error", message: "فایلی با این نام وجود دارد" });
    return;
  }

  setFiles((p) => ({ ...p, [n]: "" }));
  setFile(n);
  setNewFileOpen(false);
  setNewFileName("");
};

  const requestDeleteFile = (name) => {
    if (Object.keys(files).length <= 1) {
      setFileModal({ type: "error", message: "حداقل یک فایل باید باقی بماند" });
      return;
    }
    setFileModal({ type: "confirmDelete", name });
  };

  const confirmDeleteFile = () => {
    const name = fileModal?.name;
    setFiles((p) => {
      const next = { ...p };
      delete next[name];
      const remaining = Object.keys(next);
      if (file === name) setFile(remaining[0] || "");
      return next;
    });
    setFileModal(null);
  };

  const uploadFiles = (e) => {
    const list = e.target.files;
    if (!list?.length) return;
    Array.from(list).forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((p) => ({ ...p, [f.name]: reader.result || "" }));
        setFile(f.name);
      };
      reader.readAsText(f);
    });
    e.target.value = ""; // reset for re-upload same file
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

  return (
    <div className="h-screen bg-[#F0F4F8] flex flex-col overflow-hidden" dir="rtl">
      <Toolbar
        undo={undo}
        redo={redo}
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        size={size}
        setSize={setSize}
        canvasRef={canvasRef}
        recording={recording}
        toggleRec={toggleRec}
        mode={mode}
        setMode={setMode}
        setPdfUrl={setPdfUrl}
        onOpenSettings={() => setSettingsOpen(true)}
        onExit={() => router.push("/presenter/dashboard")}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          chatOpen={chatOpen}
          videoSrc={videoSrc}
          setVideoSrc={setVideoSrc}
          videoRef={videoRef}
          playing={playing}
          setPlaying={setPlaying}
          cameraOn={cameraOn}
          setCameraOn={setCameraOn}
          camRef={camRef}
          participants={participants}
          setParticipants={setParticipants}
          messages={messages}
          message={message}
          setMessage={setMessage}
          send={send}
        />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 p-3 overflow-hidden">
            <div className="h-full bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col">
              {mode === "whiteboard" && (
                <Whiteboard canvasRef={canvasRef} start={start} move={move} end={end} addText={addText} />
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
                <IDEPanel
                  files={files}
                  file={file}
                  setFile={setFile}
                  setFiles={setFiles}
                  addFile={addFile}
                  requestDeleteFile={requestDeleteFile}
                  uploadFiles={uploadFiles}
                  getLang={getLang}
                />
              )}
            </div>
          </div>

          <BottomBar
            micOn={micOn}
            toggleMic={toggleMic}
            cameraOn={cameraOn}
            toggleCam={toggleCam}
            chatOpen={chatOpen}
            setChatOpen={setChatOpen}
          />
        </div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* مودال تایید حذف / خطای فایل در IDE — جایگزین alert() و confirm() */}
      {/* مودال تأیید حذف / خطا */}
      <ConfirmModal
        open={!!fileModal}
        title={fileModal?.type === "confirmDelete" ? "آیا مطمئن هستید؟" : "خطا"}
        description={
          fileModal?.type === "confirmDelete"
            ? `حذف فایل «${fileModal?.name}»؟`
            : fileModal?.message
        }
        confirmText={fileModal?.type === "confirmDelete" ? "حذف" : "متوجه شدم"}
        cancelText={fileModal?.type === "confirmDelete" ? "انصراف" : "متوجه شدم"}
        danger={fileModal?.type === "confirmDelete"}
        onConfirm={fileModal?.type === "confirmDelete" ? confirmDeleteFile : () => setFileModal(null)}
        onCancel={() => setFileModal(null)}
      />

      {/* مودال ساخت فایل جدید */}
      {newFileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setNewFileOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-start justify-between p-5 pb-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <FiFileText className="text-blue-500" size={22} />
                </div>
                <h3 className="font-bold text-gray-800 text-base">فایل جدید</h3>
              </div>
              <button
                onClick={() => setNewFileOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="px-5 pt-4">
              <label className="block text-sm text-gray-500 mb-1.5">نام فایل</label>
              <input
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createNewFile()}
                placeholder="مثلاً Button.jsx"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex gap-3 p-5 pt-5">
              <button
                onClick={() => setNewFileOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
              >
                انصراف
              </button>
              <button
                onClick={createNewFile}
                disabled={!newFileName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition"
              >
                ایجاد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}