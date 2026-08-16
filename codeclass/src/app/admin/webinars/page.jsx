'use client';
import { useState, useMemo } from "react";
import { FiSearch, FiX, FiPlay, FiSquare, FiSlash } from "react-icons/fi";
import { useGetAdminWebinarsQuery, useUpdateWebinarStatusMutation } from "../../../store/api/adminApis";
import { toast } from 'react-toastify';
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

const STATUS_LABELS = {
  upcoming: "برگزار نشده",
  live: "در حال پخش",
  ended: "پایان‌یافته",
  cancelled: "لغو شده",
};
const STATUS_STYLE = {
  upcoming: "bg-blue-100 text-blue-700",
  live: "bg-green-100 text-green-700",
  ended: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-100 text-red-700",
};
const TABS = [
  { key: "all", label: "همه" },
  { key: "upcoming", label: "برگزار نشده" },
  { key: "live", label: "در حال پخش" },
  { key: "ended", label: "پایان‌یافته" },
];

export default function AdminWebinarsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("webinars");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const { data: webinars = [], isLoading } = useGetAdminWebinarsQuery();
  const [updateStatus] = useUpdateWebinarStatusMutation();

  const normalize = (text) => (text || "").toLowerCase().trim();
  const filtered = useMemo(() => {
    const q = normalize(search);
    return webinars.filter((w) =>
      (!q || normalize(w.title).includes(q) || normalize(w.teacher).includes(q)) &&
      (tab === "all" || w.status === tab)
    );
  }, [webinars, search, tab]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success("وضعیت وبینار تغییر کرد");
    } catch (err) {
      toast.error("خطا در تغییر وضعیت");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} menuItems={adminMenuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">مدیریت وبینارها</h1>
            <p className="text-gray-500 mt-1 text-sm">کلاس‌های زنده و وبینارهای سیستم</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="relative max-w-md">
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو بر اساس عنوان یا مدرس..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                />
                {search && <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiX size={16} /></button>}
              </div>
              <div className="flex flex-wrap gap-2">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${tab === t.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <p className="text-center py-12 text-gray-400 text-sm">در حال بارگذاری...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center py-12 text-gray-400 text-sm">وبیناری پیدا نشد</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-5 text-right">عنوان</th>
                      <th className="p-5 text-right">مدرس</th>
                      <th className="p-5 text-right">تاریخ</th>
                      <th className="p-5 text-right">ثبت‌نام‌شده</th>
                      <th className="p-5 text-right">وضعیت</th>
                      <th className="p-5 text-right">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((w) => (
                      <tr key={w.id} className="border-t hover:bg-gray-50">
                        <td className="p-5 font-medium text-gray-800">{w.title}</td>
                        <td className="p-5 text-gray-600 text-sm">{w.teacher}</td>
                        <td className="p-5 text-gray-500 text-sm">{w.date}</td>
                        <td className="p-5">{w.registered} نفر</td>
                        <td className="p-5">
                          <span className={`px-4 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[w.status] || "bg-gray-100 text-gray-600"}`}>
                            {STATUS_LABELS[w.status] || w.status}
                          </span>
                        </td>
                        <td className="p-5">
                          {w.status === "upcoming" && (
                            <div className="flex gap-2">
                              <button onClick={() => handleStatusChange(w.id, "live")} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs bg-green-500 text-white hover:bg-green-600 transition">
                                <FiPlay size={13} /> شروع
                              </button>
                              <button onClick={() => handleStatusChange(w.id, "cancelled")} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs bg-red-50 text-red-600 hover:bg-red-100 transition">
                                <FiSlash size={13} /> لغو
                              </button>
                            </div>
                          )}
                          {w.status === "live" && (
                            <button onClick={() => handleStatusChange(w.id, "ended")} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs bg-gray-700 text-white hover:bg-gray-800 transition">
                              <FiSquare size={13} /> پایان پخش
                            </button>
                          )}
                          {(w.status === "ended" || w.status === "cancelled") && <span className="text-xs text-gray-400">بدون عملیات</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}