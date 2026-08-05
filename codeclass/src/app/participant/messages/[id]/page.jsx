'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowRight, FiSend, FiPaperclip, FiSmile, FiX, FiFile } from "react-icons/fi";

const USERS = {
  1: { name: "استاد علی محمدی", role: "مدرس" },
  2: { name: "پشتیبانی CodeClass", role: "پشتیبانی" },
  3: { name: "استاد سارا رضایی", role: "مدرس" },
};

const CHATS = {
  1: [
    { id: 1, text: "سلام، تکلیف جلسه قبل رو بررسی کردم. عالی بود!", fromMe: false, time: "10:15" },
    { id: 2, text: "ممنون استاد 🙏", fromMe: true, time: "10:18" },
  ],
  2: [{ id: 1, text: "گواهینامه دوره Figma شما آماده دانلود است.", fromMe: false, time: "08:30" }],
  3: [{ id: 1, text: "جلسه بعدی رو فراموش نکنید.", fromMe: false, time: "دیروز" }],
};

const EMOJIS = ["😀", "😂", "❤️", "👍", "🔥", "😊", "🎉", "👏", "🙏", "✨"];

export default function ParticipantChat() {
  const router = useRouter();
  const { id } = useParams();
  const user = USERS[id] || { name: "کاربر", role: "" };
  const [messages, setMessages] = useState(CHATS[id] || []);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = () => {
    if (!text.trim() && !file) return;
    const now = new Date();
    setMessages((p) => [...p, {
      id: Date.now(), text: text.trim(), fromMe: true,
      time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`,
      file: file ? { name: file.name, url: URL.createObjectURL(file) } : null,
    }]);
    setText(""); setFile(null); setShowEmoji(false);
  };

  return (
    <div className="h-screen bg-[#F5F7FA] flex flex-col" dir="rtl">
      <header className="h-16 bg-white border-b flex items-center gap-3 px-4 flex-shrink-0">
        <button onClick={() => router.push("/participant/messages")} className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl">
          <FiArrowRight size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{user.name[0]}</div>
        <div>
          <h2 className="font-bold text-gray-800 text-sm">{user.name}</h2>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.fromMe ? "justify-start" : "justify-end"}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${m.fromMe ? "bg-blue-600 text-white rounded-br-md" : "bg-white border text-gray-800 rounded-bl-md"}`}>
              {m.file && (
                <a href={m.file.url} target="_blank" rel="noreferrer" className={`flex items-center gap-2 mb-2 p-2 rounded-xl text-xs ${m.fromMe ? "bg-blue-500" : "bg-gray-50"}`}>
                  <FiFile size={14} /> <span className="truncate">{m.file.name}</span>
                </a>
              )}
              {m.text && <p className="text-sm leading-relaxed">{m.text}</p>}
              <p className={`text-[10px] mt-1 ${m.fromMe ? "text-blue-100" : "text-gray-400"}`}>{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {file && (
        <div className="px-4 py-2 bg-white border-t flex items-center gap-3">
          <FiFile className="text-blue-600" />
          <span className="text-sm flex-1 truncate">{file.name}</span>
          <button onClick={() => setFile(null)}><FiX size={18} className="text-gray-400" /></button>
        </div>
      )}

      {showEmoji && (
        <div className="px-4 py-3 bg-white border-t flex flex-wrap gap-2">
          {EMOJIS.map((e) => (
            <button key={e} onClick={() => setText((t) => t + e)} className="text-xl hover:scale-125 transition">{e}</button>
          ))}
        </div>
      )}

      <div className="bg-white border-t p-3 flex items-center gap-2 flex-shrink-0">
        <button onClick={() => setShowEmoji(!showEmoji)} className={`p-2.5 rounded-xl ${showEmoji ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}>
          <FiSmile size={20} />
        </button>
        <button onClick={() => fileRef.current?.click()} className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl">
          <FiPaperclip size={20} />
        </button>
        <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="پیام خود را بنویسید..." className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-500" />
        <button onClick={send} className="w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center">
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
}