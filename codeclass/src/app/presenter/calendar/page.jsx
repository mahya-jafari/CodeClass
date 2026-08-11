'use client';

import { useState } from "react";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";
import { presenterMenuItems } from "@/components/layout/presenterMenuItems";
import { useGetPresenterCalendarQuery } from "../../../store/api/presenterApis"; 

export default function CalendarPage() {
  const [activeMenu, setActiveMenu] = useState("calendar");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: sessions = [], isLoading } = useGetPresenterCalendarQuery();

  const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <Sidebar
        activeMenu="calendar"
        setActiveMenu={setActiveMenu}
        menuItems={presenterMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <PresenterHeader onMenuClick={() => setSidebarOpen(true)} />

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
                    {sessions
                      .filter((s) => s.day === index + 1)
                      .map((s, i) => (
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