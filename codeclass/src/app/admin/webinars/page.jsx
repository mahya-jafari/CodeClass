'use client';

import { useState, useMemo } from "react";
import { FiSearch, FiX, FiPlay, FiSquare, FiSlash } from "react-icons/fi";
import {
  useGetAdminWebinarsQuery,
  useUpdateWebinarStatusMutation,
} from "../../../store/api/adminApis";
import { toast } from "react-toastify";
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

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return webinars.filter(
      (w) =>
        (!q ||
          w.title?.toLowerCase().includes(q) ||
          w.teacher?.toLowerCase().includes(q)) &&
        (tab === "all" || w.status === tab)
    );
  }, [webinars, search, tab]);

  const changeStatus = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("وضعیت وبینار تغییر کرد");
    } catch {
      toast.error("خطا در تغییر وضعیت");
    }
  };

  const Actions = ({ webinar }) => {
    if (webinar.status === "upcoming")
      return (
        <div className="flex gap-2">
          <button
            onClick={() => changeStatus(webinar.id, "live")}
            className="flex-1 flex justify-center items-center gap-1 px-3 py-2 rounded-xl text-xs bg-green-500 text-white"
          >
            <FiPlay size={13} /> شروع
          </button>
          <button
            onClick={() => changeStatus(webinar.id, "cancelled")}
            className="flex-1 flex justify-center items-center gap-1 px-3 py-2 rounded-xl text-xs bg-red-50 text-red-600"
          >
            <FiSlash size={13} /> لغو
          </button>
        </div>
      );

    if (webinar.status === "live")
      return (
        <button
          onClick={() => changeStatus(webinar.id, "ended")}
          className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs bg-gray-700 text-white"
        >
          <FiSquare size={13} /> پایان پخش
        </button>
      );

    return <span className="text-xs text-gray-400">بدون عملیات</span>;
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        menuItems={adminMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 lg:mr-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-3 sm:p-5 lg:p-8">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              مدیریت وبینارها
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              کلاس‌های زنده و وبینارهای سیستم
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b space-y-3">
              <div className="relative w-full max-w-md">
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو بر اساس عنوان یا مدرس..."
                  className="w-full pr-10 pl-9 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`px-3 py-1.5 rounded-full text-xs ${
                      tab === t.key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <p className="py-12 text-center text-sm text-gray-400">
                در حال بارگذاری...
              </p>
            ) : !filtered.length ? (
              <p className="py-12 text-center text-sm text-gray-400">
                وبیناری پیدا نشد
              </p>
            ) : (
              <>
                {/* Desktop / Tablet */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {["عنوان", "مدرس", "تاریخ", "ثبت‌نام‌شده", "وضعیت", "عملیات"].map(
                          (x) => (
                            <th key={x} className="p-4 text-right text-sm">
                              {x}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {filtered.map((w) => (
                        <tr key={w.id} className="border-t hover:bg-gray-50">
                          <td className="p-4 font-medium">{w.title}</td>
                          <td className="p-4 text-sm text-gray-600">{w.teacher}</td>
                          <td className="p-4 text-sm text-gray-500">{w.date}</td>
                          <td className="p-4">{w.registered} نفر</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${STATUS_STYLE[w.status]}`}>
                              {STATUS_LABELS[w.status] || w.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <Actions webinar={w} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="md:hidden p-3 space-y-3">
                  {filtered.map((w) => (
                    <div
                      key={w.id}
                      className="border rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex justify-between gap-2 mb-4">
                        <h3 className="font-medium text-sm leading-6">
                          {w.title}
                        </h3>

                        <span
                          className={`h-fit shrink-0 px-2.5 py-1 rounded-full text-xs ${STATUS_STYLE[w.status]}`}
                        >
                          {STATUS_LABELS[w.status] || w.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="block text-xs text-gray-400 mb-1">
                            مدرس
                          </span>
                          {w.teacher}
                        </div>

                        <div>
                          <span className="block text-xs text-gray-400 mb-1">
                            تاریخ
                          </span>
                          {w.date}
                        </div>

                        <div>
                          <span className="block text-xs text-gray-400 mb-1">
                            ثبت‌نام‌شده
                          </span>
                          {w.registered} نفر
                        </div>
                      </div>

                      <div className="border-t mt-4 pt-4">
                        <Actions webinar={w} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}