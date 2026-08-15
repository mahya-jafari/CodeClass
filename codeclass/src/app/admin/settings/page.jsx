'use client';

import React from 'react';
import { useState } from "react";
import { FiUsers, FiBookOpen, FiDollarSign, FiVideo, FiSettings } from "react-icons/fi";
import { useGetAdminSettingsQuery } from "../../../store/api/adminApis";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

export default function AdminSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("settings");

  const { data: settings, isLoading } = useGetAdminSettingsQuery();

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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">تنظیمات سیستم</h1>
            <p className="text-gray-500 mt-1 text-sm">مدیریت تنظیمات پنل مدیریت</p>
          </div>

          {isLoading ? (
            <p>در حال بارگذاری...</p>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold mb-6">تنظیمات کلی</h2>
              <p className="text-lg">نسخه سیستم: {settings.version}</p>
              <p className="text-lg mt-4">وضعیت: {settings.status}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}