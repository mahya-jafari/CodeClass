'use client';

import React from 'react';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAdminWebinarsQuery, useUpdateWebinarStatusMutation } from "../../../store/api/adminApis";
import { toast } from 'react-toastify';
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

export default function AdminWebinarsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("webinars");

  const { data: webinars = [], isLoading } = useGetAdminWebinarsQuery();
  const [updateStatus] = useUpdateWebinarStatusMutation();

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success('وضعیت وبینار تغییر کرد');
    } catch (err) {
      toast.error('خطا در تغییر وضعیت');
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">مدیریت وبینارها</h1>
            <p className="text-gray-500 mt-1 text-sm">کلاس‌های زنده و وبینارهای سیستم</p>
          </div>

          {isLoading ? (
            <p>در حال بارگذاری...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-2xl shadow-sm border border-gray-100">
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
                  {webinars.map((w) => (
                    <tr key={w.id} className="border-t hover:bg-gray-50">
                      <td className="p-5">{w.title}</td>
                      <td className="p-5">{w.date}</td>
                      <td className="p-5">{w.attendees} نفر</td>
                      <td className="p-5">
                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${w.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {w.status === 'active' ? 'فعال' : 'غیرفعال'}
                        </span>
                      </td>
                      <td className="p-5">
                        <button
                          onClick={() => handleStatusChange(w.id, w.status === 'active' ? 'inactive' : 'active')}
                          className={`px-4 py-1 rounded ${w.status === 'active' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                        >
                          {w.status === 'active' ? 'غیرفعال' : 'فعال'}
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