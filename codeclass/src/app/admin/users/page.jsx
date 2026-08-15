'use client';

import { useState, useMemo } from "react";
import {
  FiSearch, FiX, FiTrash2, FiShield,
} from "react-icons/fi";
import { useGetAdminUsersQuery, useUpdateUserStatusMutation, useDeleteUserMutation } from "../../../store/api/adminApis";
import { toast } from 'react-toastify';
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

const ROLE_TABS = [
  { key: "all", label: "همه" },
  { key: "participant", label: "شرکت‌کننده" },
  { key: "presenter", label: "ارائه‌دهنده" },
  { key: "admin", label: "مدیر" },
];

const ROLE_LABELS = {
  participant: "شرکت‌کننده",
  presenter: "ارائه‌دهنده",
  admin: "مدیر سیستم",
};

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("users");
  const [search, setSearch] = useState("");
  const [roleTab, setRoleTab] = useState("all");

  const { data: users = [], isLoading } = useGetAdminUsersQuery();
  const [updateStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const normalize = (text) => (text || "").toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = normalize(search);
    return users.filter((u) => {
      const matchesSearch = !q || normalize(u.name).includes(q) || normalize(u.email).includes(q);
      const matchesRole = roleTab === "all" || u.role === roleTab;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleTab]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success('وضعیت کاربر تغییر کرد');
    } catch (err) {
      toast.error('خطا در تغییر وضعیت');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('این کاربر برای همیشه حذف بشه؟ این عملیات قابل بازگشت نیست.')) return;
    try {
      await deleteUser(id).unwrap();
      toast.success('کاربر حذف شد');
    } catch (err) {
      toast.error('خطا در حذف کاربر');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} menuItems={adminMenuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
            <p className="text-gray-500 mt-1 text-sm">مدیریت شرکت‌کنندگان، ارائه‌دهندگان و مدیران پلتفرم</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="relative max-w-md">
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو بر اساس نام یا ایمیل..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiX size={16} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {ROLE_TABS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setRoleTab(t.key)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${
                      roleTab === t.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              <p className="text-center py-12 text-gray-400 text-sm">کاربری پیدا نشد</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-5 text-right">نام و نقش</th>
                      <th className="p-5 text-right">ایمیل</th>
                      <th className="p-5 text-right">تاریخ عضویت</th>
                      <th className="p-5 text-right">وضعیت</th>
                      <th className="p-5 text-right">عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => {
                      const isAdmin = u.role === "admin";
                      return (
                        <tr key={u.id} className="border-t hover:bg-gray-50">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 flex-shrink-0">
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800 flex items-center gap-1.5">
                                  {u.name}
                                  {isAdmin && <FiShield size={13} className="text-indigo-500" />}
                                </div>
                                <div className="text-xs text-gray-500">{ROLE_LABELS[u.role] || u.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-5 text-gray-600 text-sm">{u.email}</td>
                          <td className="p-5 text-gray-500 text-sm">{u.date}</td>
                          <td className="p-5">
                            <span className={`px-4 py-1 rounded-full text-xs font-medium ${u.status === "فعال" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-5">
                            {isAdmin ? (
                              <span className="text-xs text-gray-400">بدون دسترسی تغییر</span>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleStatusChange(u.id, u.status === "فعال" ? "غیرفعال" : "فعال")}
                                  className={`px-3 py-1.5 rounded-xl text-xs transition ${
                                    u.status === "فعال" ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
                                  }`}
                                >
                                  {u.status === "فعال" ? "غیرفعال کردن" : "فعال کردن"}
                                </button>
                                <button
                                  onClick={() => handleDelete(u.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                                  title="حذف کاربر"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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