'use client';

import React from 'react';
import { useState } from "react";
import { FiUsers, FiBookOpen, FiDollarSign, FiVideo, FiMessageSquare, FiBarChart2 } from "react-icons/fi";
import { useGetAdminMessagesQuery } from "../../../store/api/adminApis";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

export default function AdminMessagesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("messages");

  const { data: messages = [], isLoading } = useGetAdminMessagesQuery();

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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">پیام‌ها و پشتیبانی</h1>
            <p className="text-gray-500 mt-1 text-sm">پیام‌های کاربران و پشتیبانی</p>
          </div>

          {isLoading ? (
            <p>در حال بارگذاری...</p>
          ) : (
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between">
                    <p className="font-medium">{m.userName}</p>
                    <span className="text-xs text-gray-500">{m.date}</span>
                  </div>
                  <p className="mt-2 text-gray-600">{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}