'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome, FiBookOpen, FiCalendar, FiFileText, FiAward,
  FiMessageSquare, FiSettings, FiSearch, FiX
} from "react-icons/fi";
import ParticipantSidebar from "@/components/layout/participantSidebar";
import ParticipantHeader from "@/components/layout/participantHeader";

export default function ParticipantMessages() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const menuItems = [
    { id: "dashboard", label: "داشبورد", icon: <FiHome size={20} /> },
    { id: "my-classes", label: "کلاس‌های من", icon: <FiBookOpen size={20} /> },
    { id: "calendar", label: "تقویم جلسات", icon: <FiCalendar size={20} /> },
    { id: "assignments", label: "تکالیف من", icon: <FiFileText size={20} /> },
    { id: "certificates", label: "گواهینامه‌ها", icon: <FiAward size={20} /> },
    { id: "messages", label: "پیام‌ها", icon: <FiMessageSquare size={20} />, badge: 2 },
    { id: "settings", label: "تنظیمات", icon: <FiSettings size={20} /> },
  ];

  const messages = [
    { id: 1, name: "استاد علی محمدی", message: "سلام، تکلیف جلسه قبل رو بررسی کردم. عالی بود!", time: "۱۵ دقیقه پیش", unread: true },
    { id: 2, name: "پشتیبانی CodeClass", message: "گواهینامه دوره Figma شما آماده دانلود است.", time: "۲ ساعت پیش", unread: true },
    { id: 3, name: "استاد سارا رضایی", message: "جلسه بعدی رو فراموش نکنید.", time: "دیروز", unread: false },
  ];

  const normalize = (t) => t.toLowerCase().replace(/آ/g, "ا").replace(/أ|إ|ؤ|ئ/g, "ا").trim();

  const filtered = useMemo(() => {
    const q = normalize(search);
    if (!q) return messages;
    return messages.filter((m) => normalize(m.name).includes(q) || normalize(m.message).includes(q));
  }, [search]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <ParticipantSidebar activeMenu="messages" setActiveMenu={() => {}} menuItems={menuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <ParticipantHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">پیام‌ها</h1>
            <p className="text-gray-500 mt-1 text-sm">گفتگو با اساتید و پشتیبانی</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو در پیام‌ها..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">پیامی پیدا نشد</div>
              ) : filtered.map((msg) => (
                <div key={msg.id} onClick={() => router.push(`/participant/messages/${msg.id}`)}
                  className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-gray-50 cursor-pointer transition ${msg.unread ? "bg-blue-50/50" : ""}`}>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                    {msg.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`font-medium text-sm ${msg.unread ? "text-gray-900" : "text-gray-700"}`}>{msg.name}</h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{msg.time}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 truncate mt-0.5">{msg.message}</p>
                  </div>
                  {msg.unread && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}