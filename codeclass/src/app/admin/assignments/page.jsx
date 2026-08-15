'use client';

import React from 'react';
import { useState } from "react";
import { FiUsers, FiBookOpen, FiDollarSign, FiVideo, FiAward, FiFileText } from "react-icons/fi";
import { useGetAdminAssignmentsQuery } from "../../../store/api/adminApis";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

export default function AdminAssignmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("assignments");

  const { data: assignments = [], isLoading } = useGetAdminAssignmentsQuery();

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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">تکالیف</h1>
            <p className="text-gray-500 mt-1 text-sm">مدیریت تکالیف و جوایز کاربران</p>
          </div>

          {isLoading ? (
            <p>در حال بارگذاری...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-2xl shadow-sm border border-gray-100">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-5 text-right">کاربر</th>
                    <th className="p-5 text-right">عنوان</th>
                    <th className="p-5 text-right">نمره</th>
                    <th className="p-5 text-right">وضعیت</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a.id} className="border-t hover:bg-gray-50">
                      <td className="p-5">{a.userName}</td>
                      <td className="p-5">{a.title}</td>
                      <td className="p-5 font-bold text-green-600">{a.score}</td>
                      <td className="p-5">
                        <span className={`px-4 py-1 rounded-full text-sm ${a.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}