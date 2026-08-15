'use client';

import { useState } from "react";
import { FiAward, FiDownload, FiSearch, FiX } from "react-icons/fi";
import { useGetAdminCertificatesQuery } from "../../../store/api/adminApis";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

export default function AdminCertificatesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("certificates");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: certificates = [], isLoading } = useGetAdminCertificatesQuery();

  const filtered = certificates.filter((c) => {
    const q = search.toLowerCase();
    if (filter !== "all" && c.status !== filter) return false;
    return c.userName.toLowerCase().includes(q) || c.course.toLowerCase().includes(q);
  });

  const exportCSV = () => {
    const header = "نام کاربر,دوره,امتیاز,وضعیت\n";
    const rows = filtered.map(c => `${c.userName},${c.course},${c.score},${c.status}`).join("\n");
    const blob = new Blob(["\ufeff" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "certificates.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">گواهینامه‌ها</h1>
              <p className="text-gray-500 mt-1 text-sm">گواهینامه‌های دریافتی کاربران</p>
            </div>
            <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm">
              <FiDownload size={16} /> خروجی CSV
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Search & Filter */}
            <div className="p-4 border-b flex flex-wrap gap-3">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجو در نام یا دوره..."
                    className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FiX size={16} />
                    </button>
                  )}
                </div>
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white"
              >
                <option value="all">همه</option>
                <option value="صادر شده">صادر شده</option>
                <option value="در انتظار">در انتظار</option>
              </select>
            </div>

            {isLoading ? (
              <p className="text-center py-12">در حال بارگذاری...</p>
            ) : (
              <div className="divide-y divide-gray-100 p-4">
                {filtered.length === 0 ? (
                  <p className="text-center py-12 text-gray-500">هیچ گواهینامه‌ای پیدا نشد</p>
                ) : (
                  filtered.map((cert) => (
                    <div key={cert.id} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-5">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{cert.userName}</h3>
                        <p className="text-xs text-gray-500 mt-1">{cert.course}</p>
                      </div>
                      <div className="bg-blue-50 text-center py-6 rounded-xl w-32">
                        <p className="text-3xl font-bold text-blue-700">امتیاز</p>
                        <p className="text-5xl font-bold text-blue-700 mt-2">{cert.score}</p>
                      </div>
                      <span className={`px-4 py-1.5 text-xs font-medium rounded-full self-end sm:self-auto ${cert.status === "صادر شده" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {cert.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}