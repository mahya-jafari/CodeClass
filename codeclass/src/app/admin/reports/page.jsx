'use client';

import React from 'react';
import { useState } from "react";
import { FiUsers, FiBookOpen, FiDollarSign, FiVideo, FiBarChart2 } from "react-icons/fi";
import { useGetAdminReportsQuery } from "../../../store/api/adminApis";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

export default function AdminReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("reports");

  const { data: reports = [], isLoading } = useGetAdminReportsQuery();

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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">گزارش‌ها</h1>
            <p className="text-gray-500 mt-1 text-sm">گزارش‌های تحلیلی سیستم</p>
          </div>

          {isLoading ? (
            <p>در حال بارگذاری...</p>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6">گزارش فروش ماهانه</h2>
              <div className="h-80 bg-gray-100 rounded-xl flex items-end justify-center text-6xl font-bold text-gray-400">
                {reports.totalRevenue} تومان
              </div>
              <p className="text-center mt-4 text-gray-500">تعداد کاربران جدید: {reports.newUsers}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}