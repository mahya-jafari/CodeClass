'use client';

import { useState } from "react";
import {
  FiHome, FiBookOpen, FiCalendar, FiFileText, FiAward,
  FiMessageSquare, FiSettings, FiMenu
} from "react-icons/fi";
import ParticipantSidebar from "@/components/layout/participantSidebar";
import ParticipantHeader from "@/components/layout/participantHeader";

export default function ParticipantSettings() {
  const [activeMenu, setActiveMenu] = useState("settings");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "داشبورد", icon: <FiHome size={20} /> },
    { id: "my-classes", label: "کلاس‌های من", icon: <FiBookOpen size={20} /> },
    { id: "calendar", label: "تقویم جلسات", icon: <FiCalendar size={20} /> },
    { id: "assignments", label: "تکالیف من", icon: <FiFileText size={20} /> },
    { id: "certificates", label: "گواهینامه‌ها", icon: <FiAward size={20} /> },
    { id: "messages", label: "پیام‌ها", icon: <FiMessageSquare size={20} />, badge: 2 },
    { id: "settings", label: "تنظیمات", icon: <FiSettings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <ParticipantSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} menuItems={menuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <ParticipantHeader></ParticipantHeader>
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">   
             <div className="mb-6 sm:mb-8 text-center sm:text-right">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">تنظیمات</h1>
                <p className="text-gray-500 mt-1 text-sm">مدیریت حساب کاربری</p>
             </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">اطلاعات پروفایل</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">نام و نام خانوادگی</label>
                  <input type="text" defaultValue="سارا احمدی" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">ایمیل</label>
                  <input type="email" defaultValue="sara@example.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">شماره موبایل</label>
                  <input type="text" defaultValue="09121234567" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
                </div>
              </div>
            </div>

            <hr />

            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">تغییر رمز عبور</h2>
              <div className="space-y-4 max-w-md">
                <input type="password" placeholder="رمز عبور فعلی" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
                <input type="password" placeholder="رمز عبور جدید" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
                <input type="password" placeholder="تکرار رمز عبور جدید" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
              </div>
            </div>

            <div className="pt-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 rounded-xl font-medium transition text-sm">
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}