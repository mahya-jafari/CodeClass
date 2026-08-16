'use client';

import { useState } from "react";
import { FiUsers, FiTrendingUp } from "react-icons/fi";
import { useGetAdminReportsQuery } from "../../../store/api/adminApis";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

function BarChart({ months, values, color, valueSuffix = "" }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end justify-between gap-2 sm:gap-4 h-56 px-2">
      {values.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
          <span className="text-[10px] sm:text-xs text-gray-500">{v.toLocaleString("fa-IR")}{valueSuffix}</span>
          <div
            className={`w-full rounded-t-lg ${color} transition-all`}
            style={{ height: `${Math.max((v / max) * 100, 4)}%` }}
          />
          <span className="text-[10px] sm:text-xs text-gray-500">{months[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("reports");

  const { data: reports, isLoading } = useGetAdminReportsQuery();

  const months = reports?.months || [];
  const userGrowth = reports?.userGrowth || [];
  const revenue = reports?.revenue || [];

  const latestUsers = userGrowth[userGrowth.length - 1] ?? 0;
  const prevUsers = userGrowth[userGrowth.length - 2] ?? latestUsers;
  const userGrowthPercent = prevUsers ? Math.round(((latestUsers - prevUsers) / prevUsers) * 100) : 0;

  const latestRevenue = revenue[revenue.length - 1] ?? 0;
  const prevRevenue = revenue[revenue.length - 2] ?? latestRevenue;
  const revenueGrowthPercent = prevRevenue ? Math.round(((latestRevenue - prevRevenue) / prevRevenue) * 100) : 0;

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
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">گزارش‌ها</h1>
            <p className="text-gray-500 mt-1 text-sm">روند رشد کاربران و درآمد پلتفرم</p>
          </div>

          {isLoading ? (
            <p className="text-center py-12 text-gray-500">در حال بارگذاری...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">کاربران جدید ({months[months.length - 1]})</p>
                    <p className="text-2xl font-bold text-gray-800">{latestUsers.toLocaleString("fa-IR")}</p>
                    <p className={`text-xs mt-1 ${userGrowthPercent >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {userGrowthPercent >= 0 ? "+" : ""}{userGrowthPercent}٪ نسبت به ماه قبل
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FiUsers size={22} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">درآمد ({months[months.length - 1]})</p>
                    <p className="text-2xl font-bold text-gray-800">{latestRevenue}M تومان</p>
                    <p className={`text-xs mt-1 ${revenueGrowthPercent >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {revenueGrowthPercent >= 0 ? "+" : ""}{revenueGrowthPercent}٪ نسبت به ماه قبل
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                    <FiTrendingUp size={22} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-800 mb-6">رشد کاربران (۶ ماه اخیر)</h2>
                  <BarChart months={months} values={userGrowth} color="bg-blue-500" />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-800 mb-6">درآمد ماهانه (میلیون تومان)</h2>
                  <BarChart months={months} values={revenue} color="bg-green-500" valueSuffix="M" />
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}