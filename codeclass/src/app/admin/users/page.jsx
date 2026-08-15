'use client';

import { useState } from "react";
import {
  FiUsers, FiTrendingUp, FiCheck, FiX
} from "react-icons/fi";
import { useGetAdminUsersQuery, useUpdateUserStatusMutation, useDeleteUserMutation } from "../../../store/api/adminApis";
import { toast } from 'react-toastify';
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("users");

  const { data: users = [], isLoading } = useGetAdminUsersQuery();
  const [updateStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success('وضعیت کاربر تغییر کرد');
    } catch (err) {
      toast.error('خطا');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('حذف شود؟')) return;
    await deleteUser(id).unwrap();
    toast.success('کاربر حذف شد');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} menuItems={adminMenuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
          </div>

          {isLoading ? <p className="text-center">در حال بارگذاری...</p> : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-5 text-right">نام و نقش</th>
                    <th className="p-5 text-right">ایمیل</th>
                    <th className="p-5 text-right">وضعیت</th>
                    <th className="p-5 text-right">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-gray-50">
                      <td className="p-5">
                        <div className="font-medium">{u.name}</div>
                        <div className="text-xs text-gray-500">{u.role}</div>
                      </td>
                      <td className="p-5 text-gray-600">{u.email}</td>
                      <td className="p-5">
                        <span className={`px-4 py-1 rounded-full text-xs font-medium ${u.status === "فعال" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-5 flex gap-2">
                        <button onClick={() => handleStatusChange(u.id, u.status === "فعال" ? "غیرفعال" : "فعال")} className="px-4 py-1.5 bg-red-500 text-white rounded-xl text-xs">
                          {u.status === "فعال" ? "غیرفعال" : "فعال"}
                        </button>
                        <button onClick={() => handleDelete(u.id)} className="px-4 py-1.5 bg-red-500 text-white rounded-xl text-xs">حذف</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}