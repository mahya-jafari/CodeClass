'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome,
  FiBookOpen,
  FiPlusCircle,
  FiCalendar,
  FiBarChart2,
  FiMessageSquare,
  FiSettings,
  FiBell,
  FiUsers,
  FiVideo,
  FiClock,
  FiMenu,
} from "react-icons/fi";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";

export default function PresenterDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

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
    { title: "جلسات این هفته", value: "۱۲", icon: <FiClock size={22} />, color: "text-blue-500" },
    { title: "کلاس‌های فعال", value: "۸", icon: <FiVideo size={22} />, color: "text-purple-500" },
    { title: "کل دانشجویان", value: "۲۳۶", icon: <FiUsers size={22} />, color: "text-green-500" },
    { title: "کل کلاس‌ها", value: "۵", icon: <FiBookOpen size={22} />, color: "text-orange-500" },
  ];

  const classes = [
    {
      id: 1,
      title: "آموزش React از صفر تا پیشرفته",
      category: "برنامه‌نویسی وب",
      students: 24,
      sessions: 18,
      status: "فعال",
      image: "https://via.placeholder.com/80x80?text=React",
      color: "bg-blue-100",
    },
    {
      id: 2,
      title: "جامع JavaScript",
      category: "برنامه‌نویسی وب",
      students: 31,
      sessions: 17,
      status: "فعال",
      image: "https://via.placeholder.com/80x80?text=JS",
      color: "bg-yellow-100",
    },
    {
      id: 3,
      title: "Python برای مبتدیان",
      category: "برنامه‌نویسی",
      students: 18,
      sessions: 15,
      status: "فعال",
      image: "https://via.placeholder.com/80x80?text=Python",
      color: "bg-green-100",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      {/* Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        menuItems={menuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 lg:mr-64 transition-all duration-300">
        {/* Header */}
        <PresenterHeader></PresenterHeader>

        <div className="p-4 sm:p-6 lg:p-8">
          {/* Greeting */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              سلام سارا احمدی 👋
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">خوش آمدید به داشبوردتان</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* list of classes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">کلاس‌های من</h2>
              <button 
              onClick={() => router.push("/presenter/my-classes")}
              className="text-sm text-blue-600 hover:underline">مشاهده همه</button>
            </div>

            <div className="divide-y divide-gray-100">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 ${cls.color}`}>
                      <img
                        src={cls.image}
                        alt={cls.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{cls.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{cls.category}</p>
                      <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FiUsers size={13} /> {cls.students} دانشجو
                        </span>
                        <span className="flex items-center gap-1">
                          <FiClock size={13} /> {cls.sessions} جلسه
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                      {cls.status}
                    </span>
                    <button
                    onClick={() => router.push(`/presenter/my-classes/${cls.id}`)} 
                    className="text-xs sm:text-sm bg-blue-50 text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl hover:bg-blue-100 transition">
                      مدیریت کلاس
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}