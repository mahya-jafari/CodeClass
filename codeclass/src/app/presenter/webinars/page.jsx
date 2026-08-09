'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FiVideo, FiPlus, FiSearch, FiUsers, FiClock, FiCalendar,
  FiPlay, FiTrash2, FiX, FiFilter
} from "react-icons/fi";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { presenterMenuItems } from "@/components/layout/presenterMenuItems";

export default function WebinarsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: "", details: "", date: "", time: "", capacity: "" });

  const [webinars, setWebinars] = useState([
    {
      id: 1,
      title: "آشنایی با React 19 و قابلیت‌های جدید",
      date: "۱۴۰۵/۰۲/۱۵",
      time: "۱۸:۰۰",
      capacity: 200,
      registered: 87,
      status: "upcoming",
      duration: "۹۰ دقیقه",
    },
    {
      id: 2,
      title: "وبینار رایگان JavaScript پیشرفته",
      date: "۱۴۰۵/۰۲/۱۰",
      time: "۱۷:۰۰",
      capacity: 150,
      registered: 142,
      status: "live",
      duration: "۶۰ دقیقه",
    },
    {
      id: 3,
      title: "مسیر شغلی برنامه‌نویسی فرانت‌اند",
      date: "۱۴۰۵/۰۱/۲۰",
      time: "۱۹:۰۰",
      capacity: 300,
      registered: 256,
      status: "ended",
      duration: "۷۵ دقیقه",
    },
  ]);

  const normalize = (t) =>
    t.toLowerCase().replace(/آ/g, "ا").replace(/أ|إ|ؤ|ئ/g, "ا").trim();

  const filtered = useMemo(() => {
    const q = normalize(search);
    return webinars.filter((w) => {
      const matchSearch = !q || normalize(w.title).includes(q);
      const matchStatus = statusFilter === "all" || w.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, webinars]);

  const statusMap = {
    upcoming: { label: "آینده", cls: "bg-blue-100 text-blue-700" },
    live: { label: "در حال برگزاری", cls: "bg-green-100 text-green-700" },
    ended: { label: "پایان‌یافته", cls: "bg-gray-100 text-gray-600" },
  };

  const createWebinar = () => {
    if (!form.title.trim()) return;
    setWebinars((prev) => [
      {
        id: Date.now(),
        title: form.title,
        details: form.details,
        date: form.date || "—",
        time: form.time || "—",
        capacity: Number(form.capacity) || 100,
        registered: 0,
        status: "upcoming",
        duration: "۶۰ دقیقه",
      },
      ...prev,
    ]);
    setForm({ title: "", details: "", date: "", time: "", capacity: "" });
    setCreateOpen(false);
  };

  const confirmDelete = () => {
    setWebinars((prev) => prev.filter((w) => w.id !== deleteModal.id));
    setDeleteModal({ open: false, id: null, title: "" });
  };

  const startWebinar = (id) => {
    router.push(`/presenter/classroom/${id}?type=webinar`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <Sidebar
        activeMenu="webinars"
        setActiveMenu={() => {}}
        menuItems={presenterMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <PresenterHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          {/* header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">وبینارها</h1>
              <p className="text-gray-500 mt-1 text-sm">برگزاری و مدیریت وبینارهای آنلاین</p>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
            >
              <FiPlus size={18} /> ایجاد وبینار جدید
            </button>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[
              { label: "کل وبینارها", value: webinars.length, color: "text-blue-600" },
              { label: "در حال برگزاری", value: webinars.filter((w) => w.status === "live").length, color: "text-green-600" },
              { label: "آینده", value: webinars.filter((w) => w.status === "upcoming").length, color: "text-purple-600" },
              { label: "ثبت‌نام‌ها", value: webinars.reduce((s, w) => s + w.registered, 0), color: "text-orange-500" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
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
                    { id: "live", label: "در حال برگزاری" },
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

          {/* list */}
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
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1"><FiCalendar size={12} /> {w.date}</span>
                      <span className="flex items-center gap-1"><FiClock size={12} /> {w.time} · {w.duration}</span>
                      <span className="flex items-center gap-1"><FiUsers size={12} /> {w.registered}/{w.capacity}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {(w.status === "upcoming" || w.status === "live") && (
                      <button
                        onClick={() => startWebinar(w.id)}
                        className="flex items-center gap-1.5 text-xs sm:text-sm bg-green-600 hover:bg-green-700 text-white px-3.5 py-2 rounded-xl transition"
                      >
                        <FiPlay size={14} />
                        {w.status === "live" ? "ورود به وبینار" : "شروع وبینار"}
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteModal({ open: true, id: w.id, title: w.title })}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* create modal */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setCreateOpen(false)}>
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800 text-lg">ایجاد وبینار جدید</h3>
              <button onClick={() => setCreateOpen(false)}><FiX size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">عنوان وبینار</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="مثلاً: وبینار React پیشرفته"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">جزئیات وبینار</label>
                <textarea
                    value={form.details}
                    onChange={(e) => setForm({ ...form, details: e.target.value })}
                    placeholder="توضیحات کوتاه درباره موضوع و محتوای وبینار..."
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
                </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">تاریخ</label>
                  <input
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="۱۴۰۵/۰۲/۲۰"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">ساعت</label>
                  <input
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    placeholder="۱۸:۰۰"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">ظرفیت شرکت‌کنندگان</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  placeholder="۲۰۰"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={createWebinar}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition"
            >
              ایجاد وبینار
            </button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteModal.open}
        title="حذف وبینار"
        description={`آیا از حذف «${deleteModal.title}» مطمئن هستید؟`}
        confirmText="بله، حذف شود"
        cancelText="انصراف"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, title: "" })}
      />
    </div>
  );
}