'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiBookOpen, FiCalendar, FiFileText, FiClock, FiVideo
} from "react-icons/fi";
import ParticipantSidebar from "@/components/layout/participantSidebar";
import ParticipantHeader from "@/components/layout/participantHeader";
import { participantMenuItems } from "@/components/layout/participantMenuItems";
import { useGetParticipantDashboardQuery } from "../../../store/api/participantApis";

export default function ParticipantDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data } = useGetParticipantDashboardQuery();

  const statsData = data?.stats ?? [];
  const myClasses = data?.myClasses ?? [];
  const webinars = data?.webinars ?? [];
  const upcoming = data?.upcoming ?? [];
  const notifications = data?.notifications ?? [];

  const icons = [
    <FiBookOpen size={20} key="book" />,
    <FiCalendar size={20} key="cal" />,
    <FiFileText size={20} key="file" />,
    <FiClock size={20} key="clock" />,
  ];

  const stats = statsData.map((s, i) => ({ ...s, icon: icons[i] }));

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <ParticipantSidebar
        activeMenu="dashboard"
        setActiveMenu={() => {}}
        menuItems={participantMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <ParticipantHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">سلام سارا احمدی 👋</h1>
            <p className="text-gray-500 mt-1 text-sm">به داشبورد خود خوش آمدید</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">{s.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">{s.value}</p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                  {s.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">کلاس‌های من</h2>
                <button onClick={() => router.push("/participant/my-classes")} className="text-sm text-blue-600 hover:underline">
                  مشاهده همه
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {myClasses.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => router.push(`/participant/classroom/${c.id}`)}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ${c.color}`}>
                      <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm truncate">{c.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{c.teacher}</p>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>پیشرفت</span>
                          <span>{c.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${c.progress}%` }} />
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 hidden sm:block whitespace-nowrap">{c.nextSession}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-800 text-sm">جلسات پیش رو</h2>
                  <button onClick={() => router.push("/participant/calendar")} className="text-xs text-blue-600 hover:underline">
                    مشاهده همه
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  {upcoming.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => router.push("/participant/classroom/1")}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition"
                    >
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                        {s.tag}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{s.title}</p>
                        <p className="text-xs text-gray-500">{s.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-800 text-sm">اعلان‌ها</h2>
                </div>
                <div className="p-4 space-y-3">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => router.push(n.href)}
                      className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-800">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden my-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <FiVideo className="text-purple-500" /> وبینارها
              </h2>
              <button onClick={() => router.push("/participant/webinars")} className="text-sm text-blue-600 hover:underline">
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
                    onClick={() =>
                      router.push(
                        w.status === "live"
                          ? `/participant/classroom/${w.id}?type=webinar`
                          : "/participant/webinars"
                      )
                    }
                    className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition"
                  >
                    {w.status === "live" ? "ورود" : "جزئیات"}
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