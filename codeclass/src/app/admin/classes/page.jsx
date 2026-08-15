'use client';

import { useState, useMemo } from "react";
import {
  FiBookOpen, FiSearch, FiX, FiCheck, FiTrash2, FiSlash,
} from "react-icons/fi";
import {
  useGetAdminClassesQuery,
  useUpdateClassStatusMutation,
  useDeleteAdminClassMutation,
} from "../../../store/api/adminApis";
import { toast } from 'react-toastify';
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

const TABS = [
  { key: "all", label: "همه" },
  { key: "فعال", label: "فعال" },
  { key: "در انتظار تأیید", label: "در انتظار تأیید" },
  { key: "غیرفعال", label: "غیرفعال" },
];

const statusStyle = {
  "فعال": "bg-green-100 text-green-700",
  "غیرفعال": "bg-gray-100 text-gray-600",
  "در انتظار تأیید": "bg-orange-100 text-orange-700",
};

export default function AdminClassesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("classes");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const { data: classes = [], isLoading } = useGetAdminClassesQuery();
  const [updateStatus] = useUpdateClassStatusMutation();
  const [deleteClass] = useDeleteAdminClassMutation();

  const normalize = (text) => (text || "").toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = normalize(search);
    return classes.filter((c) => {
      const matchesSearch =
        !q || normalize(c.title).includes(q) || normalize(c.teacher).includes(q);
      const matchesTab = tab === "all" || c.status === tab;
      return matchesSearch && matchesTab;
    });
  }, [classes, search, tab]);

  const pendingCount = classes.filter((c) => c.status === "در انتظار تأیید").length;

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success('وضعیت کلاس تغییر کرد');
    } catch (err) {
      toast.error('خطا در تغییر وضعیت');
    }
  };

  const handleApprove = (id) => handleStatusChange(id, "فعال");
  const handleReject = (id) => handleStatusChange(id, "غیرفعال");

  const handleDelete = async (id) => {
    if (!confirm('این کلاس برای همیشه حذف بشه؟ این عملیات قابل بازگشت نیست.')) return;
    try {
      await deleteClass(id).unwrap();
      toast.success('کلاس حذف شد');
    } catch (err) {
      toast.error('خطا در حذف کلاس');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} menuItems={adminMenuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">مدیریت کلاس‌ها</h1>
            <p className="text-gray-500 mt-1 text-sm">
              مشاهده، تأیید و مدیریت کلاس‌های پلتفرم
              {pendingCount > 0 && (
                <span className="mr-1 text-orange-600 font-medium">
                  ({pendingCount} کلاس در انتظار تأیید)
                </span>
              )}
            </p>
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

            {isLoading ? (
              <p className="text-center py-12 text-gray-400 text-sm">در حال بارگذاری...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center py-12 text-gray-400 text-sm">کلاسی پیدا نشد</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-5 text-right">عنوان</th>
                      <th className="p-5 text-right">مدرس</th>
                      <th className="p-5 text-right">تاریخ</th>
                      <th className="p-5 text-right">دانشجویان</th>
                      <th className="p-5 text-right">وضعیت</th>
                      <th className="p-5 text-right">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.id} className="border-t hover:bg-gray-50">
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                              <FiBookOpen size={16} />
                            </div>
                            <span className="font-medium text-gray-800">{c.title}</span>
                          </div>
                        </td>
                        <td className="p-5 text-gray-600">{c.teacher}</td>
                        <td className="p-5 text-gray-500 text-sm">{c.date}</td>
                        <td className="p-5">{c.students} نفر</td>
                        <td className="p-5">
                          <span className={`px-4 py-1 rounded-full text-xs font-medium ${statusStyle[c.status] || "bg-gray-100 text-gray-600"}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-5">
                          {c.status === "در انتظار تأیید" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(c.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs bg-green-500 text-white hover:bg-green-600 transition"
                              >
                                <FiCheck size={13} /> تأیید
                              </button>
                              <button
                                onClick={() => handleReject(c.id)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs bg-gray-500 text-white hover:bg-gray-600 transition"
                              >
                                <FiSlash size={13} /> رد
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusChange(c.id, c.status === "فعال" ? "غیرفعال" : "فعال")}
                                className={`px-3 py-1.5 rounded-xl text-xs transition ${
                                  c.status === "فعال" ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                              >
                                {c.status === "فعال" ? "غیرفعال کردن" : "فعال کردن"}
                              </button>
                              <button
                                onClick={() => handleDelete(c.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                                title="حذف کلاس"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          )}
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