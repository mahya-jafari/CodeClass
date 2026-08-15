'use client';

import { useState } from "react";
import {
  FiBookOpen, FiTrendingUp, FiCheck, FiX
} from "react-icons/fi";
import { useGetAdminClassesQuery, useUpdateClassStatusMutation } from "../../../store/api/adminApis";
import { toast } from 'react-toastify';
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

export default function AdminClassesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("classes");

  const { data: classes = [], isLoading } = useGetAdminClassesQuery();
  const [updateStatus] = useUpdateClassStatusMutation();

  const handleStatusChange = async (id, newStatus) => {
    await updateStatus({ id, status: newStatus }).unwrap();
    toast.success('وضعیت کلاس تغییر کرد');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} menuItems={adminMenuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">مدیریت کلاس‌ها</h1>
          </div>

          {isLoading ? <p className="text-center">در حال بارگذاری...</p> : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-5 text-right">عنوان</th>
                    <th className="p-5 text-right">تاریخ</th>
                    <th className="p-5 text-right">حضور</th>
                    <th className="p-5 text-right">وضعیت</th>
                    <th className="p-5 text-right">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c.id} className="border-t hover:bg-gray-50">
                      <td className="p-5">{c.title}</td>
                      <td className="p-5">{c.date}</td>
                      <td className="p-5">{c.attendees} نفر</td>
                      <td className="p-5">
                        <span className={`px-4 py-1 rounded-full text-xs font-medium ${c.status === "فعال" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-5">
                        <button onClick={() => handleStatusChange(c.id, c.status === "فعال" ? "غیرفعال" : "فعال")} className={`px-4 py-1.5 rounded-xl text-xs ${c.status === "فعال" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
                          {c.status === "فعال" ? "غیرفعال" : "فعال"}
                        </button>
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