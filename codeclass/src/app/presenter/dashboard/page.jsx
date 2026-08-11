'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiUsers,
  FiVideo,
  FiClock,
  FiDollarSign,
  FiTrendingUp,
} from "react-icons/fi";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";
import { presenterMenuItems } from "@/components/layout/presenterMenuItems";
import {
  useGetDashboardStatsQuery,
  useGetDashboardClassesQuery,
  useGetDashboardWebinarsQuery,
} from "../../../store/api/presenterApis";

export default function PresenterDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const { data: statsData = [] } = useGetDashboardStatsQuery();
  const { data: classes = [] } = useGetDashboardClassesQuery();
  const { data: webinars = [] } = useGetDashboardWebinarsQuery();

  const stats = statsData.map((stat, index) => {
    const icons = [
      <FiClock size={22} key="clock" />,
      <FiVideo size={22} key="video" />,
      <FiUsers size={22} key="users" />,
      <FiDollarSign size={22} key="dollar" />,
    ];
    return {
      ...stat,
      icon: icons[index],
    };
  });

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <Sidebar
        activeMenu="dashboard"
        setActiveMenu={setActiveMenu}
        menuItems={presenterMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <PresenterHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          {/* greeting */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              سلام سارا احمدی 👋
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">خوش آمدید به داشبوردتان</p>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-4">
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

          {/* mini insight from reports */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-5 py-3 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FiTrendingUp className="text-purple-500" size={18} />
              <span>نرخ تکمیل کلاس‌ها</span>
              <span className="font-bold text-gray-800">۸۷٪</span>
            </div>
            <div className="flex-1 max-w-xs bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: "87%" }} />
            </div>
            <button
              onClick={() => router.push("/presenter/finance")}
              className="text-xs text-blue-600 hover:underline whitespace-nowrap"
            >
              جزئیات مالی →
            </button>
          </div>

          {/* classes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-bold text-gray-800">کلاس‌های من</h2>
              <button
                onClick={() => router.push("/presenter/my-classes")}
                className="text-sm text-blue-600 hover:underline"
              >
                مشاهده همه
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {classes.map((cls) => (
                <div
                  key={cls.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 ${cls.color}`}>
                      <img src={cls.image} alt={cls.title} className="w-full h-full object-cover" />
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
                      className="text-xs sm:text-sm bg-blue-50 text-blue-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl hover:bg-blue-100 transition"
                    >
                      مدیریت کلاس
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* webinars */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden my-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">وبینارهای من</h2>
              <button
                onClick={() => router.push("/presenter/webinars")}
                className="text-sm text-blue-600 hover:underline"
              >
                مشاهده همه
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {webinars.map((w) => (
                <div key={w.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <FiVideo size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm truncate">{w.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{w.time}</p>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${
                      w.status === "live" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {w.status === "live" ? "زنده" : "آینده"}
                  </span>
                  <button
                    onClick={() => router.push(`/presenter/classroom/${w.id}?type=webinar`)}
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition"
                  >
                    {w.status === "live" ? "ورود" : "شروع"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}