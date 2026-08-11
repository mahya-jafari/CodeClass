'use client';

import { useState, useMemo } from "react";
import {
  FiSearch, FiFile, FiDownload, FiEye, FiX, FiFilter, FiFileText
} from "react-icons/fi";
import ParticipantSidebar from "@/components/layout/participantSidebar";
import ParticipantHeader from "@/components/layout/participantHeader";
import { participantMenuItems } from "@/components/layout/participantMenuItems";
import { useGetParticipantPamphletsQuery } from "../../../store/api/participantApis";

export default function ParticipantPamphletsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const { data: pamphlets = [] } = useGetParticipantPamphletsQuery();

  const classOptions = [
    "آموزش React از صفر تا پیشرفته",
    "جامع JavaScript",
    "Python برای مبتدیان",
  ];

  const normalize = (t) =>
    t.toLowerCase().replace(/آ/g, "ا").replace(/أ|إ|ؤ|ئ/g, "ا").trim();

  const filtered = useMemo(() => {
    const q = normalize(search);
    return pamphlets.filter((m) => {
      const matchSearch =
        !q || normalize(m.title).includes(q) || normalize(m.className).includes(q);
      const matchClass = classFilter === "all" || m.className === classFilter;
      return matchSearch && matchClass;
    });
  }, [search, classFilter, pamphlets]);

  const typeStyle = (type) => {
    if (type === "pdf") return "from-red-500 to-rose-400";
    if (["doc", "docx"].includes(type)) return "from-blue-500 to-sky-400";
    if (["ppt", "pptx"].includes(type)) return "from-orange-500 to-amber-400";
    return "from-gray-500 to-gray-400";
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <ParticipantSidebar
        activeMenu="pamphlets"
        setActiveMenu={() => {}}
        menuItems={participantMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <ParticipantHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">جزوات درسی</h1>
            <p className="text-gray-500 mt-1 text-sm">مشاهده و دانلود فایل‌های آموزشی کلاس‌ها</p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            {[
              { label: "کل جزوات", value: pamphlets.length, color: "text-blue-600" },
              { label: "فایل PDF", value: pamphlets.filter((m) => m.type === "pdf").length, color: "text-red-500" },
              { label: "سایر فایل‌ها", value: pamphlets.filter((m) => m.type !== "pdf").length, color: "text-purple-500" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <FiSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو در عنوان یا کلاس..."
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
                  classFilter !== "all" ? "border-blue-400 text-blue-600 bg-blue-50" : "border-gray-200"
                }`}
              >
                <FiFilter size={15} />
                {classFilter === "all" ? "همه کلاس‌ها" : classFilter.slice(0, 18) + (classFilter.length > 18 ? "…" : "")}
              </button>
              {filterOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
                  <button
                    onClick={() => { setClassFilter("all"); setFilterOpen(false); }}
                    className={`w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50 ${
                      classFilter === "all" ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                    }`}
                  >
                    همه کلاس‌ها
                  </button>
                  {classOptions.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setClassFilter(c); setFilterOpen(false); }}
                      className={`w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50 truncate ${
                        classFilter === c ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center text-gray-400">
                <FiFileText size={36} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">جزوه‌ای پیدا نشد</p>
              </div>
            ) : (
              filtered.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeStyle(m.type)} flex items-center justify-center text-white flex-shrink-0`}>
                      <FiFile size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm truncate">{m.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{m.className}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                          {m.type}
                        </span>
                        <span className="text-[11px] text-gray-400">{m.size}</span>
                        <span className="text-[11px] text-gray-300">|</span>
                        <span className="text-[11px] text-gray-400">{m.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition"
                    >
                      <FiEye size={14} /> مشاهده
                    </a>
                    <a
                      href={m.url}
                      download
                      className="flex items-center gap-1.5 text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 px-3.5 py-2 rounded-xl transition"
                    >
                      <FiDownload size={14} /> دانلود
                    </a>
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