'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FiArrowRight, FiSend, FiPaperclip, FiSmile, FiX, FiFile
} from "react-icons/fi";

const USERS = {
  1: { name: "سارا احمدی", role: "دانشجو" },
  2: { name: "محمد رضایی", role: "دانشجو" },
  3: { name: "نگار محمدی", role: "دانشجو" },
};

const INITIAL_CHATS = {
  1: [
    { id: 1, text: "سلام، جلسه بعدی چه زمانی برگزار می‌شود؟", fromMe: false, time: "10:20" },
    { id: 2, text: "سلام سارا، جلسه بعدی سه‌شنبه ساعت ۱۸ هست.", fromMe: true, time: "10:22" },
  ],
  2: [
    { id: 1, text: "فایل‌های جلسه قبل رو می‌تونم دریافت کنم؟", fromMe: false, time: "09:15" },
  ],
  3: [
    { id: 1, text: "ممنون از کلاس عالی امروز", fromMe: false, time: "دیروز" },
    { id: 2, text: "خواهش می‌کنم نگار، موفق باشی 🌱", fromMe: true, time: "دیروز" },
  ],
};

const EMOJIS = ["😀", "😂", "❤️", "👍", "🔥", "😊", "🎉", "👏", "🙏", "✨", "💯", "😎"];

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const user = USERS[id] || { name: "کاربر", role: "دانشجو" };

  const [messages, setMessages] = useState(INITIAL_CHATS[id] || []);
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState(null);
  const bottomRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!text.trim() && !file) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: text.trim(),
        fromMe: true,
        time,
        file: file
          ? { name: file.name, url: URL.createObjectURL(file), type: file.type }
          : null,
      },
    ]);
    setText("");
    setFile(null);
    setShowEmoji(false);
  };

  const addEmoji = (emoji) => {
    setText((t) => t + emoji);
  };

  return (
    <div className="h-screen bg-[#F5F7FA] flex flex-col" dir="rtl">
      {/* Header */}
      <header className="h-16 bg-white border-b flex items-center gap-3 px-4 sm:px-6 flex-shrink-0">
        <button
          onClick={() => router.push("/provider/messages")}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
        >
          <FiArrowRight size={20} />
        </button>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-bold text-gray-800 text-sm">{user.name}</h2>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.fromMe ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-2.5 ${
                msg.fromMe
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-white border border-gray-100 text-gray-800 rounded-bl-md"
              }`}
            >
              {msg.file && (
                <a
                  href={msg.file.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-2 mb-2 p-2 rounded-xl text-xs ${
                    msg.fromMe ? "bg-blue-500" : "bg-gray-50"
                  }`}
                >
                  <FiFile size={16} />
                  <span className="truncate">{msg.file.name}</span>
                </a>
              )}
              {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
              <p
                className={`text-[10px] mt-1 ${
                  msg.fromMe ? "text-blue-100" : "text-gray-400"
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* File Preview */}
      {file && (
        <div className="px-4 py-2 bg-white border-t flex items-center gap-3">
          <FiFile className="text-blue-600" />
          <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
            <FiX size={18} />
          </button>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="px-4 py-3 bg-white border-t flex flex-wrap gap-2">
          {EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => addEmoji(e)}
              className="text-xl hover:scale-125 transition"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t p-3 sm:p-4 flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setShowEmoji(!showEmoji)}
          className={`p-2.5 rounded-xl transition ${
            showEmoji ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          <FiSmile size={20} />
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl"
        >
          <FiPaperclip size={20} />
        </button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
        />

        <button
          onClick={send}
          className="w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition"
        >
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
}