'use client';

import { useState, useMemo } from "react";
import { FiBookOpen, FiSearch, FiX, FiCheck, FiTrash2, FiSlash } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useGetAdminClassesQuery,
  useUpdateClassStatusMutation,
  useDeleteAdminClassMutation,
} from "../../../store/api/adminApis";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";
import ConfirmModal from "@/components/ui/ConfirmModal";

const TABS = [
  ["all", "همه"],
  ["فعال", "فعال"],
  ["در انتظار تأیید", "در انتظار تأیید"],
  ["غیرفعال", "غیرفعال"],
];

const STATUS_STYLE = {
  فعال: "bg-green-100 text-green-700",
  غیرفعال: "bg-gray-100 text-gray-600",
  "در انتظار تأیید": "bg-orange-100 text-orange-700",
};

export default function AdminClassesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [deleteId, setDeleteId] = useState(null);

  const { data: classes = [], isLoading } = useGetAdminClassesQuery();
  const [updateStatus] = useUpdateClassStatusMutation();
  const [deleteClass] = useDeleteAdminClassMutation();

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return classes.filter(c =>
      (!q || c.title?.toLowerCase().includes(q) || c.teacher?.toLowerCase().includes(q)) &&
      (tab === "all" || c.status === tab)
    );
  }, [classes, search, tab]);

  const pendingCount = classes.filter(c => c.status === "در انتظار تأیید").length;

  const changeStatus = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("وضعیت کلاس تغییر کرد");
    } catch {
      toast.error("خطا در تغییر وضعیت");
    }
  };

  const approve = (id) => changeStatus(id, "فعال");
  const reject = (id) => changeStatus(id, "غیرفعال");

  const openDeleteConfirm = (id) => setDeleteId(id);
  const handleDelete = () => {
    deleteClass(deleteId).unwrap();
    toast.success("کلاس حذف شد");
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar activeMenu="classes" setActiveMenu={() => {}} menuItems={adminMenuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 lg:mr-64 min-w-0">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <header className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">مدیریت کلاس‌ها</h1>
            <p className="text-gray-500 mt-1 text-sm">
              مشاهده، تأیید و مدیریت کلاس‌های پلتفرم
              {pendingCount > 0 && <span className="mr-1 text-orange-600 font-medium">({pendingCount} کلاس در انتظار تأیید)</span>}
            </p>
          </header>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="relative w-full max-w-md">
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="جستجو بر اساس عنوان یا مدرس..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiX size={16} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {TABS.map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${tab === key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <p className="text-center py-12 text-gray-400 text-sm">در حال بارگذاری...</p>
            ) : !filtered.length ? (
              <p className="text-center py-12 text-gray-400 text-sm">کلاسی پیدا نشد</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="hidden md:table-header-group bg-gray-50">
                    <tr>
                      {["عنوان", "مدرس", "تاریخ", "دانشجویان", "وضعیت", "عملیات"].map(x => (
                        <th key={x} className="p-4 lg:p-5 text-right text-sm">{x}</th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map(c => (
                      <tr key={c.id} className="block md:table-row border-t hover:bg-gray-50">
                        <td className="block md:table-cell p-4 lg:p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                              <FiBookOpen size={16} />
                            </div>
                            <span className="font-medium text-gray-800">{c.title}</span>
                          </div>
                        </td>
                        <td className="block md:table-cell px-4 pb-2 md:p-5 text-sm text-gray-600">
                          <span className="md:hidden font-medium text-gray-400 ml-2">مدرس:</span>
                          {c.teacher}
                        </td>
                        <td className="block md:table-cell px-4 pb-2 md:p-5 text-sm text-gray-500">
                          <span className="md:hidden font-medium text-gray-400 ml-2">تاریخ:</span>
                          {c.date}
                        </td>
                        <td className="block md:table-cell px-4 pb-2 md:p-5 text-sm text-gray-600">
                          <span className="md:hidden font-medium text-gray-400 ml-2">دانشجویان:</span>
                          {c.students} نفر
                        </td>
                        <td className="block md:table-cell px-4 pb-2 md:p-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[c.status] || "bg-gray-100 text-gray-600"}`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="block md:table-cell p-4 md:p-5">
                          {c.status === "در انتظار تأیید" ? (
                            <div className="flex flex-wrap gap-2">
                              <button onClick={() => approve(c.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs bg-green-500 text-white hover:bg-green-600 transition">
                                <FiCheck size={13} /> تأیید
                              </button>
                              <button onClick={() => reject(c.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs bg-gray-500 text-white hover:bg-gray-600 transition">
                                <FiSlash size={13} /> رد
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => changeStatus(c.id, c.status === "فعال" ? "غیرفعال" : "فعال")}
                                className={`px-3 py-1.5 rounded-xl text-xs text-white ${c.status === "فعال" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                              >
                                {c.status === "فعال" ? "غیرفعال کردن" : "فعال کردن"}
                              </button>
                              <button
                                onClick={() => openDeleteConfirm(c.id)}
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
          </section>
        </div>
      </main>

      <ConfirmModal
        open={!!deleteId}
        title="حذف کلاس"
        description="آیا مطمئن هستید که می‌خواهید این کلاس را برای همیشه حذف کنید؟ این عملیات قابل بازگشت نیست."
        confirmText="حذف"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}