'use client';

import { useState, useMemo } from "react";
import {
  FiSearch, FiFilter, FiX, FiTrash2, FiUserCheck, FiUserX
} from "react-icons/fi";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";
import ConfirmModal from "@/components/ui/ConfirmModal";
import {
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
} from "../../../store/api/adminApis";

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: "" });

  const { data: users = [] } = useGetAdminUsersQuery();
  const [updateStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const normalize = (t) => t.toLowerCase().replace(/آ/g, "ا").replace(/أ|إ|ؤ|ئ/g, "ا").trim();

  const filtered = useMemo(() => {
    const q = normalize(search);
    return users.filter((u) => {
      const matchSearch = !q || normalize(u.name).includes(q) || normalize(u.email).includes(q);
      const matchRole = roleFilter === "all" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [search, roleFilter, users]);

  const toggleStatus = async (id, current) => {
    await updateStatus({ id, status: current === "فعال" ? "غیرفعال" : "فعال" });
  };

  const confirmDelete = async () => {
    await deleteUser(deleteModal.id);
    setDeleteModal({ open: false, id: null, name: "" });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar
        activeMenu="users"
        setActiveMenu={() => {}}
        menuItems={adminMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
            <p className="text-gray-500 mt-1 text-sm">مشاهده و مدیریت تمام کاربران سیستم</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <FiSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو بر اساس نام یا ایمیل..."
                className="w-full pr-10 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400"
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
                  roleFilter !== "all" ? "border-indigo-400 text-indigo-600 bg-indigo-50" : "border-gray-200"
                }`}
              >
                <FiFilter size={15} /> نقش
              </button>
              {filterOpen && (
                <div className="absolute left-0 top-full mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
                  {[
                    { id: "all", label: "همه" },
                    { id: "presenter", label: "ارائه‌دهنده" },
                    { id: "participant", label: "شرکت‌کننده" },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => { setRoleFilter(f.id); setFilterOpen(false); }}
                      className={`w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50 ${
                        roleFilter === f.id ? "bg-indigo-50 text-indigo-600 font-medium" : "text-gray-700"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-xs">
                    <th className="text-right px-5 py-3 font-medium">کاربر</th>
                    <th className="text-right px-5 py-3 font-medium">نقش</th>
                    <th className="text-right px-5 py-3 font-medium">تاریخ ثبت‌نام</th>
                    <th className="text-right px-5 py-3 font-medium">وضعیت</th>
                    <th className="text-right px-5 py-3 font-medium">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${
                          u.role === "presenter" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"
                        }`}>
                          {u.role === "presenter" ? "ارائه‌دهنده" : "شرکت‌کننده"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{u.date}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full ${
                          u.status === "فعال" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleStatus(u.id, u.status)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                            title={u.status === "فعال" ? "غیرفعال کردن" : "فعال کردن"}
                          >
                            {u.status === "فعال" ? <FiUserX size={16} /> : <FiUserCheck size={16} />}
                          </button>
                          <button
                            onClick={() => setDeleteModal({ open: true, id: u.id, name: u.name })}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                            title="حذف"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <ConfirmModal
        open={deleteModal.open}
        title="حذف کاربر"
        description={`آیا از حذف «${deleteModal.name}» مطمئن هستید؟`}
        confirmText="بله، حذف شود"
        cancelText="انصراف"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, name: "" })}
      />
    </div>
  );
}