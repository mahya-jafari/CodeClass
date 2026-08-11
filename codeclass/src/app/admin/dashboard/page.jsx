'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiUsers, FiBookOpen, FiDollarSign, FiVideo,
  FiTrendingUp, FiCheck, FiX
} from "react-icons/fi";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";
import { useGetAdminDashboardQuery } from "../../../store/api/adminApis";
export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const { data } = useGetAdminDashboardQuery();

  const statsData = data?.stats ?? [];
  const recentUsers = data?.recentUsers ?? [];
  const recentClasses = data?.recentClasses ?? [];
  const pendingWithdrawals = data?.pendingWithdrawals ?? [];

  const icons = [
    <FiUsers size={22} key="users" />,
    <FiBookOpen size={22} key="book" />,
    <FiDollarSign size={22} key="dollar" />,
    <FiVideo size={22} key="video" />,
  ];

  const stats = statsData.map((s, i) => ({ ...s, icon: icons[i] }));

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
          {/* greeting */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">داشبورد مدیریت</h1>
            <p className="text-gray-500 mt-1 text-sm">خلاصه وضعیت سیستم CodeClass</p>
          </div>

          {/* stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-6 sm:mb-8">
            {stats.map((s, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">{s.title}</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">{s.value}</p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${s.change.startsWith("+") ? "text-green-600" : "text-gray-400"}`}>
                    <FiTrendingUp size={12} />
                    {s.change} نسبت به ماه قبل
                  </p>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                  {s.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* recent users */}
            <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800">کاربران اخیر</h2>
                <button
                  onClick={() => router.push("/admin/users")}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  مشاهده همه
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm">{u.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{u.role} · {u.date}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        u.status === "فعال"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* pending withdrawals */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-800 text-sm">درخواست‌های برداشت</h2>
                <button
                  onClick={() => router.push("/admin/finance")}
                  className="text-xs text-indigo-600 hover:underline"
                >
                  همه
                </button>
              </div>
              <div className="p-4 space-y-3">
                {pendingWithdrawals.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">درخواستی وجود ندارد</p>
                ) : (
                  pendingWithdrawals.map((w) => (
                    <div key={w.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-800">{w.name}</p>
                        <p className="text-sm font-bold text-gray-800">
                          {w.amount.toLocaleString("fa-IR")}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mb-3">{w.date}</p>
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 py-1.5 rounded-lg transition">
                          <FiCheck size={13} /> تأیید
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 py-1.5 rounded-lg transition">
                          <FiX size={13} /> رد
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* recent classes */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">کلاس‌های اخیر</h2>
              <button
                onClick={() => router.push("/admin/classes")}
                className="text-sm text-indigo-600 hover:underline"
              >
                مشاهده همه
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {recentClasses.map((c) => (
                <div key={c.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <FiBookOpen size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm truncate">{c.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {c.teacher} · {c.students} دانشجو
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      c.status === "فعال"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {c.status}
                  </span>
                  {c.status === "در انتظار تأیید" && (
                    <div className="flex gap-1.5">
                      <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg">
                        <FiCheck size={16} />
                      </button>
                      <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                        <FiX size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}