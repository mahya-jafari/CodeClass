'use client';

import { useState } from "react";
import {
  FiHome, FiBookOpen, FiPlusCircle, FiCalendar, FiBarChart2,
  FiMessageSquare, FiSettings, FiMenu
} from "react-icons/fi";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";

export default function SettingsPage() {
  const [activeMenu, setActiveMenu] = useState("settings");
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
            <div className="max-w-3xl mx-auto">   
             <div className="mb-6 sm:mb-8 text-center sm:text-right">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">تنظیمات</h1>
                <p className="text-gray-500 mt-1 text-sm">مدیریت حساب کاربری و تنظیمات سیستم</p>
             </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-6 sm:space-y-8">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">اطلاعات پروفایل</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">نام و نام خانوادگی</label>
                  <input type="text" defaultValue="علی محمدی" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">ایمیل</label>
                  <input type="email" defaultValue="ali@example.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">شماره موبایل</label>
                  <input type="text" defaultValue="09123456789" className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
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