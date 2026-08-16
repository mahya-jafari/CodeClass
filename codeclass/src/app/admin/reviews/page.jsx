'use client';

import { useState, useMemo } from "react";
import { FiSearch, FiX, FiCheck, FiEyeOff, FiTrash2, FiStar } from "react-icons/fi";
import {
  useGetAdminReviewsQuery,
  useUpdateReviewStatusMutation,
  useDeleteReviewMutation,
} from "../../../store/api/adminApis";
import { toast } from 'react-toastify';
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

const TABS = [
  { key: "all", label: "همه" },
  { key: "در انتظار", label: "در انتظار" },
  { key: "تأیید شده", label: "تأیید شده" },
  { key: "مخفی شده", label: "مخفی شده" },
];

const STATUS_STYLE = {
  "در انتظار": "bg-yellow-100 text-yellow-700",
  "تأیید شده": "bg-green-100 text-green-700",
  "مخفی شده": "bg-gray-100 text-gray-600",
};

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <FiStar key={i} size={14} fill={i < rating ? "currentColor" : "none"} className={i < rating ? "" : "text-gray-300"} />
      ))}
    </div>
  );
}

export default function AdminReviewsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("reviews");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const { data: reviews = [], isLoading } = useGetAdminReviewsQuery();
  const [updateStatus] = useUpdateReviewStatusMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const normalize = (text) => (text || "").toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = normalize(search);
    return reviews.filter((r) => {
      const matchesSearch = !q || normalize(r.userName).includes(q) || normalize(r.className).includes(q);
      const matchesTab = tab === "all" || r.status === tab;
      return matchesSearch && matchesTab;
    });
  }, [reviews, search, tab]);

  const pendingCount = reviews.filter((r) => r.status === "در انتظار").length;

  const handleApprove = async (id) => {
    try {
      await updateStatus({ id, status: "تأیید شده" }).unwrap();
      toast.success('نظر تأیید شد');
    } catch (err) {
      toast.error('خطا در تأیید نظر');
    }
  };

  const handleHide = async (id) => {
    try {
      await updateStatus({ id, status: "مخفی شده" }).unwrap();
      toast.success('نظر مخفی شد');
    } catch (err) {
      toast.error('خطا در مخفی کردن نظر');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('این نظر برای همیشه حذف بشه؟')) return;
    try {
      await deleteReview(id).unwrap();
      toast.success('نظر حذف شد');
    } catch (err) {
      toast.error('خطا در حذف نظر');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        menuItems={adminMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">نظرات و امتیازها</h1>
            <p className="text-gray-500 mt-1 text-sm">
              مدیریت نظرات ثبت‌شده روی کلاس‌ها
              {pendingCount > 0 && (
                <span className="mr-1 text-orange-600 font-medium">
                  ({pendingCount} نظر در انتظار بررسی)
                </span>
              )}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-3xl">
            <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="relative">
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو بر اساس کاربر یا کلاس..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiX size={16} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${
                      tab === t.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {isLoading ? (
                <p className="text-center py-12 text-gray-400 text-sm">در حال بارگذاری...</p>
              ) : filtered.length === 0 ? (
                <p className="text-center py-12 text-gray-400 text-sm">نظری پیدا نشد</p>
              ) : (
                filtered.map((r) => (
                  <div key={r.id} className="px-4 sm:px-5 py-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-medium text-gray-800 text-sm">{r.userName}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{r.className} · {r.date}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-1 rounded-full flex-shrink-0 ${STATUS_STYLE[r.status] || "bg-gray-100 text-gray-600"}`}>
                        {r.status}
                      </span>
                    </div>
                    <Stars rating={r.rating} />
                    <p className="text-sm text-gray-600 mt-2 leading-6">{r.comment}</p>
                    <div className="flex gap-2 mt-3">
                      {r.status !== "تأیید شده" && (
                        <button
                          onClick={() => handleApprove(r.id)}
                          className="flex items-center gap-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg transition"
                        >
                          <FiCheck size={13} /> تأیید
                        </button>
                      )}
                      {r.status !== "مخفی شده" && (
                        <button
                          onClick={() => handleHide(r.id)}
                          className="flex items-center gap-1 text-xs bg-gray-50 text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition"
                        >
                          <FiEyeOff size={13} /> مخفی کردن
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="flex items-center gap-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                      >
                        <FiTrash2 size={13} /> حذف
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}