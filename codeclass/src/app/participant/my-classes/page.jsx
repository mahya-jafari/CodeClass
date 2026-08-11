'use client';

import { useState } from "react";
import { FiSearch, FiUsers, FiClock } from "react-icons/fi";
import ParticipantSidebar from "@/components/layout/participantSidebar";
import ParticipantHeader from "@/components/layout/participantHeader";
import { participantMenuItems } from "@/components/layout/participantMenuItems";
import { useGetParticipantClassesQuery } from "../../../store/api/participantApis";

export default function ParticipantMyClasses() {
  const [activeMenu, setActiveMenu] = useState("my-classes");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: classes = [] } = useGetParticipantClassesQuery();

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <ParticipantSidebar
        activeMenu="my-classes"
        setActiveMenu={setActiveMenu}
        menuItems={participantMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <ParticipantHeader onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">کلاس‌های من</h1>
            <p className="text-gray-500 mt-1 text-sm">تمام کلاس‌هایی که در آن‌ها ثبت‌نام کرده‌اید</p>
          </div>

          <div className="relative mb-6 max-w-md">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="جستجو در کلاس‌ها..." className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ${cls.color}`}>
                    <img src={cls.image} alt={cls.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{cls.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{cls.teacher}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><FiUsers size={13} /> {cls.students}</span>
                      <span className="flex items-center gap-1"><FiClock size={13} /> {cls.sessions} جلسه</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                    <span>پیشرفت دوره</span>
                    <span className="font-medium">{cls.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${cls.progress}%` }}></div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cls.status === "در حال برگزاری" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {cls.status}
                  </span>
                  <button className="text-sm text-blue-600 hover:underline font-medium cursor-pointer">ورود به کلاس</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}