'use client';

import { useState, useMemo } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useGetAdminAssignmentsQuery } from "../../../store/api/adminApis";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

export default function AdminAssignmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("assignments");
  const [search, setSearch] = useState("");

  const { data: assignments = [], isLoading } = useGetAdminAssignmentsQuery();

  const normalize = (text) => (text || "").toLowerCase().trim();

  const filtered = useMemo(() => {
    const q = normalize(search);
    if (!q) return assignments;
    return assignments.filter(
      (a) => normalize(a.user).includes(q) || normalize(a.title).includes(q) || normalize(a.course).includes(q)
    );
  }, [assignments, search]);

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
            <p className="text-gray-500 mt-1 text-sm">نظارت بر تکالیف ارسال‌شده‌ی دانشجویان</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative max-w-md">
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="جستجو بر اساس کاربر، عنوان یا دوره..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <p className="text-center py-12 text-gray-400 text-sm">در حال بارگذاری...</p>
            ) : filtered.length === 0 ? (
              <p className="text-center py-12 text-gray-400 text-sm">تکلیفی پیدا نشد</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-5 text-right">کاربر</th>
                      <th className="p-5 text-right">عنوان تکلیف</th>
                      <th className="p-5 text-right">دوره</th>
                      <th className="p-5 text-right">تاریخ ارسال</th>
                      <th className="p-5 text-right">نمره</th>
                      <th className="p-5 text-right">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.id} className="border-t hover:bg-gray-50">
                        <td className="p-5 font-medium text-gray-800">{a.user}</td>
                        <td className="p-5 text-gray-700">{a.title}</td>
                        <td className="p-5 text-gray-500 text-sm">{a.course}</td>
                        <td className="p-5 text-gray-500 text-sm">{a.date}</td>
                        <td className="p-5">
                          {a.score != null ? (
                            <span className="font-bold text-green-600">{a.score}</span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="p-5">
                          <span className={`px-4 py-1 rounded-full text-xs font-medium ${a.status === 'تحویل شده' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
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
        </div>
      </main>
    </div>
  );
}