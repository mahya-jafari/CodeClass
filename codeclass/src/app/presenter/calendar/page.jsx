'use client';

import { useState } from "react";
import {
  FiHome, FiBookOpen, FiPlusCircle, FiCalendar, FiBarChart2,
  FiMessageSquare, FiSettings, FiMenu
} from "react-icons/fi";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";

export default function CalendarPage() {
  const [activeMenu, setActiveMenu] = useState("calendar");
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

  const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
  const sessions = [
    { day: 1, time: "۱۰:۰۰", title: "React - جلسه ۱۲", color: "bg-blue-100 text-blue-700" },
    { day: 2, time: "۱۶:۰۰", title: "JavaScript - جلسه ۹", color: "bg-yellow-100 text-yellow-700" },
    { day: 4, time: "۱۱:۰۰", title: "Python - جلسه ۷", color: "bg-green-100 text-green-700" },
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">تقویم جلسات</h1>
            <p className="text-gray-500 mt-1 text-sm">برنامه زمانی کلاس‌های این هفته</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-7 border-b border-gray-100">
                {days.map((day) => (
                  <div key={day} className="py-3 sm:py-4 text-center text-xs sm:text-sm font-medium text-gray-600 border-l last:border-l-0">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 min-h-[350px] sm:min-h-[400px]">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="border-l border-gray-100 p-2 sm:p-3 min-h-[100px]">
                    <div className="text-xs text-gray-400 mb-2">{index + 1}</div>
                    {sessions.filter((s) => s.day === index + 1).map((s, i) => (
                      <div key={i} className={`text-xs p-2 rounded-lg mb-2 ${s.color}`}>
                        <div className="font-medium">{s.time}</div>
                        <div className="truncate">{s.title}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}