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

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return assignments.filter(a =>
      !q ||
      a.user?.toLowerCase().includes(q) ||
      a.title?.toLowerCase().includes(q) ||
      a.course?.toLowerCase().includes(q)
    );
  }, [assignments, search]);

  const Status = ({ status }) => (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
      status === "تحویل شده"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}>
      {status}
    </span>
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        menuItems={adminMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 lg:mr-64">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-3 sm:p-5 lg:p-8">
          <header className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              تکالیف
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              نظارت بر تکالیف ارسال‌شده‌ی دانشجویان
            </p>
          </header>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-3 sm:p-4 border-b">
              <div className="relative w-full max-w-md">
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="جستجو بر اساس کاربر، عنوان یا دوره..."
                  className="w-full pr-10 pl-9 py-2.5 border rounded-xl text-sm outline-none focus:border-blue-500"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <p className="py-12 text-center text-sm text-gray-400">
                در حال بارگذاری...
              </p>
            ) : !filtered.length ? (
              <p className="py-12 text-center text-sm text-gray-400">
                تکلیفی پیدا نشد
              </p>
            ) : (
              <>
                {/* Desktop / Tablet */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {["کاربر","عنوان تکلیف","دوره","تاریخ ارسال","نمره","وضعیت"].map(x => (
                          <th key={x} className="p-4 text-right text-sm">
                            {x}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {filtered.map(a => (
                        <tr key={a.id} className="border-t hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium shrink-0">
                                {a.user?.charAt(0)}
                              </div>
                              <span className="font-medium">{a.user}</span>
                            </div>
                          </td>

                          <td className="p-4 text-sm">{a.title}</td>
                          <td className="p-4 text-sm text-gray-500">{a.course}</td>
                          <td className="p-4 text-sm text-gray-500">{a.date}</td>

                          <td className="p-4">
                            {a.score != null
                              ? <b className="text-green-600">{a.score}</b>
                              : <span className="text-gray-400">—</span>}
                          </td>

                          <td className="p-4">
                            <Status status={a.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="md:hidden p-3 space-y-3">
                  {filtered.map(a => (
                    <div
                      key={a.id}
                      className="p-4 border rounded-2xl shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium shrink-0">
                          {a.user?.charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <div className="font-medium text-sm truncate">
                            {a.user}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {a.title}
                          </div>
                        </div>

                        <div className="mr-auto">
                          <Status status={a.status} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <small className="block text-gray-400 mb-1">
                            دوره
                          </small>
                          {a.course}
                        </div>

                        <div>
                          <small className="block text-gray-400 mb-1">
                            تاریخ ارسال
                          </small>
                          {a.date}
                        </div>

                        <div>
                          <small className="block text-gray-400 mb-1">
                            نمره
                          </small>
                          {a.score != null
                            ? <b className="text-green-600">{a.score}</b>
                            : <span className="text-gray-400">—</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}