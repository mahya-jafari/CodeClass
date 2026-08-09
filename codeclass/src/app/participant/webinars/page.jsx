'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome, FiBookOpen, FiCalendar, FiFileText, FiAward,
  FiMessageSquare, FiSettings, FiVideo, FiSearch, FiUsers,
  FiClock, FiCalendar as FiCal, FiX, FiFilter, FiCheck
} from "react-icons/fi";
import ParticipantSidebar from "@/components/layout/participantSidebar";
import ParticipantHeader from "@/components/layout/participantHeader";
import { participantMenuItems } from "@/components/layout/participantMenuItems";

export default function ParticipantWebinarsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const [webinars, setWebinars] = useState([
    {
      id: 1,
      title: "آشنایی با React 19 و قابلیت‌های جدید",
      details: "بررسی ویژگی‌های جدید React 19 و نحوه استفاده در پروژه‌های واقعی",
      date: "۱۴۰۵/۰۲/۱۵",
      time: "۱۸:۰۰",
      capacity: 200,
      registered: 87,
      status: "upcoming",
      duration: "۹۰ دقیقه",
      joined: false,
      teacher: "استاد علی محمدی",
    },
    {
      id: 2,
      title: "وبینار رایگان JavaScript پیشرفته",
      details: "مباحث پیشرفته جاوااسکریپت برای توسعه‌دهندگان",
      date: "۱۴۰۵/۰۲/۱۰",
      time: "۱۷:۰۰",
      capacity: 150,
      registered: 142,
      status: "live",
      duration: "۶۰ دقیقه",
      joined: true,
      teacher: "استاد سارا رضایی",
    },
    {
      id: 3,
      title: "مسیر شغلی برنامه‌نویسی فرانت‌اند",
      details: "راهنمای ورود به بازار کار فرانت‌اند",
      date: "۱۴۰۵/۰۱/۲۰",
      time: "۱۹:۰۰",
      capacity: 300,
      registered: 256,
      status: "ended",
      duration: "۷۵ دقیقه",
      joined: true,
      teacher: "استاد علی محمدی",
    },
  ]);

  const normalize = (t) =>
    t.toLowerCase().replace(/آ/g, "ا").replace(/أ|إ|ؤ|ئ/g, "ا").trim();

  const filtered = useMemo(() => {
    const q = normalize(search);
    return webinars.filter((w) => {
      const matchSearch = !q || normalize(w.title).includes(q) || normalize(w.details || "").includes(q);
      const matchStatus = statusFilter === "all" || w.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, webinars]);

  const statusMap = {
    upcoming: { label: "آینده", cls: "bg-blue-100 text-blue-700" },
    live: { label: "زنده", cls: "bg-green-100 text-green-700" },
    ended: { label: "پایان‌یافته", cls: "bg-gray-100 text-gray-600" },
  };

  const toggleJoin = (id) => {
    setWebinars((prev) =>
      prev.map((w) => {
        if (w.id !== id || w.status === "ended" || w.status === "live") return w;
        return {
          ...w,
          joined: !w.joined,
          registered: w.joined ? w.registered - 1 : w.registered + 1,
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <ParticipantSidebar
        activeMenu="webinars"
        setActiveMenu={() => {}}
        menuItems={participantMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <ParticipantHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">وبینارها</h1>
            <p className="text-gray-500 mt-1 text-sm">ثبت‌نام و شرکت در وبینارهای آنلاین</p>
          </div>

          {/* search + filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <FiSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو در وبینارها..."
                className="w-full pr-10 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiX size={15} />
                </button>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-sm ${
                  statusFilter !== "all" ? "border-blue-400 text-blue-600 bg-blue-50" : "border-gray-200"
                }`}
              >
                <FiFilter size={15} /> وضعیت
              </button>
              {filterOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
                  {[
                    { id: "all", label: "همه" },
                    { id: "live", label: "زنده" },
                    { id: "upcoming", label: "آینده" },
                    { id: "ended", label: "پایان‌یافته" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => { setStatusFilter(f.id); setFilterOpen(false); }}
                      className={`w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50 ${
                        statusFilter === f.id ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">
                <FiVideo size={36} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">وبیناری پیدا نشد</p>
              </div>
            ) : (
              filtered.map((w) => (
                <div
                  key={w.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 flex items-center justify-center text-white flex-shrink-0">
                    <FiVideo size={22} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{w.title}</h3>
                      <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${statusMap[w.status].cls}`}>
                        {statusMap[w.status].label}
                      </span>
                    </div>
                    {w.details && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{w.details}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1.5">
                      <span className="flex items-center gap-1"><FiCal size={12} /> {w.date}</span>
                      <span className="flex items-center gap-1"><FiClock size={12} /> {w.time} · {w.duration}</span>
                      <span className="flex items-center gap-1"><FiUsers size={12} /> {w.registered}/{w.capacity}</span>
                      <span>{w.teacher}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {w.status === "live" && (
                      <button
                        onClick={() => router.push(`/participant/classroom/${w.id}?type=webinar`)}
                        className="text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-xl transition"
                      >
                        ورود به وبینار
                      </button>
                    )}
                    {w.status === "upcoming" && (
                      <button
                        onClick={() => toggleJoin(w.id)}
                        className={`flex items-center gap-1.5 text-xs sm:text-sm px-3.5 py-2 rounded-xl transition ${
                          w.joined
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {w.joined ? (<><FiCheck size={14} /> ثبت‌نام شده</>) : "ثبت‌نام"}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}