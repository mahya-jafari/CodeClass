'use client';

import { useState } from "react";
import {
  FiHome, FiBookOpen, FiPlusCircle, FiCalendar, FiBarChart2,
  FiMessageSquare, FiSettings, FiTrendingUp, FiUsers, FiDollarSign, FiMenu
} from "react-icons/fi";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";

export default function ReportsPage() {
  const [activeMenu, setActiveMenu] = useState("reports");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "داشبورد", icon: <FiHome size={20} /> },
    { id: "my-classes", label: "کلاس‌های من", icon: <FiBookOpen size={20} /> },
    { id: "new-class", label: "برگزاری کلاس جدید", icon: <FiPlusCircle size={20} /> },
    { id: "calendar", label: "تقویم جلسات", icon: <FiCalendar size={20} /> },
    { id: "reports", label: "گزارش‌ها", icon: <FiBarChart2 size={20} /> },
    { id: "messages", label: "پیام‌ها", icon: <FiMessageSquare size={20} />, badge: 3 },
    { id: "settings", label: "تنظیمات", icon: <FiSettings size={20} /> },
  ];

  const stats = [
    { title: "درآمد این ماه", value: "۱۲,۴۵۰,۰۰۰", icon: <FiDollarSign size={22} />, color: "text-green-500" },
    { title: "دانشجویان جدید", value: "۴۸", icon: <FiUsers size={22} />, color: "text-blue-500" },
    { title: "نرخ تکمیل کلاس", value: "۸۷٪", icon: <FiTrendingUp size={22} />, color: "text-purple-500" },
    { title: "کلاس‌های فعال", value: "۸", icon: <FiBookOpen size={22} />, color: "text-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        menuItems={menuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <PresenterHeader></PresenterHeader>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">گزارش‌ها</h1>
            <p className="text-gray-500 mt-1 text-sm">آمار و تحلیل عملکرد کلاس‌ها</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-lg sm:text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">نمودار عملکرد</h2>
            <div className="h-48 sm:h-64 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              اینجا می‌توانید نمودار قرار دهید
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}