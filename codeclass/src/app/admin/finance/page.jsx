'use client';

import { useState } from "react";
import { FiDollarSign, FiTrendingUp, FiCreditCard, FiDownload, FiCheck, FiX } from "react-icons/fi";
import { useGetAdminFinanceQuery, useApproveWithdrawalMutation, useRejectWithdrawalMutation } from "../../../store/api/adminApis";
import { toast } from 'react-toastify';
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

export default function AdminFinancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("finance");

  const { data: financeData = {}, isLoading } = useGetAdminFinanceQuery();
  const [approve] = useApproveWithdrawalMutation();
  const [reject] = useRejectWithdrawalMutation();

  const handleApprove = async (id) => {
    try {
      await approve(id).unwrap();
      toast.success("برداشت با موفقیت تأیید شد");
    } catch (err) {
      toast.error("خطا در تأیید برداشت");
    }
  };

  const handleReject = async (id) => {
    try {
      await reject(id).unwrap();
      toast.success("برداشت با موفقیت رد شد");
    } catch (err) {
      toast.error("خطا در رد برداشت");
    }
  };

  const exportCSV = () => {
    if (!financeData.recentTransactions) return;
    const header = "تاریخ,نوع,مبلغ,وضعیت\n";
    const rows = financeData.recentTransactions
      .map(tx => `${tx.date},${tx.type},${tx.amount} تومان,${tx.status}`)
      .join("\n");
    const blob = new Blob(["\ufeff" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
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
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">مدیریت مالی</h1>
            <p className="text-gray-500 mt-1 text-sm">درآمد و برداشت‌های سیستم</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-5 mb-6">
            {financeData.summary?.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{s.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                  {i === 0 ? <FiDollarSign size={22} /> : i === 1 ? <FiTrendingUp size={22} /> : <FiCreditCard size={22} />}
                </div>
              </div>
            ))}
          </div>

          {isLoading ? (
            <p className="text-center py-12 text-gray-500">در حال بارگذاری...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* تفکیک درآمد */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-bold text-gray-800 mb-4">تفکیک درآمد</h2>
                <div className="space-y-4">
                  {financeData.summary?.slice(0, 2).map((s, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{s.title}</span>
                        <span className="font-medium">{s.value}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-2 ${i === 0 ? "bg-green-500" : "bg-purple-500"} rounded-full`} style={{ width: "100%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* لیست برداشت‌ها */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800">درخواست‌های برداشت</h2>
                  <button onClick={exportCSV} className="flex items-center gap-2 text-xs text-blue-600 hover:underline">
                    <FiDownload size={14} /> خروجی CSV
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {financeData.withdrawals?.map((w) => (
                    <div key={w.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-800">{w.name}</p>
                        <p className="text-xs text-gray-500">{w.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-xl font-bold text-red-600">{w.amount.toLocaleString("fa-IR")} تومان</p>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${w.status === "تأیید شده" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {w.status}
                        </span>
                        {w.status === "در انتظار" && (
                          <>
                            <button onClick={() => handleApprove(w.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-xl">
                              <FiCheck size={20} />
                            </button>
                            <button onClick={() => handleReject(w.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl">
                              <FiX size={20} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* تراکنش‌های اخیر */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-bold text-gray-800 mb-4">تراکنش‌های اخیر</h2>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="p-4 text-right text-xs font-medium text-gray-500">تاریخ</th>
                        <th className="p-4 text-right text-xs font-medium text-gray-500">نوع</th>
                        <th className="p-4 text-right text-xs font-medium text-gray-500">مبلغ</th>
                        <th className="p-4 text-right text-xs font-medium text-gray-500">وضعیت</th>
                        <th className="p-4 text-right text-xs font-medium text-gray-500">عملیات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financeData.recentTransactions?.map((tx) => (
                        <tr key={tx.id} className="border-t hover:bg-gray-50">
                          <td className="p-4 text-sm">{tx.date}</td>
                          <td className="p-4 text-sm">{tx.type}</td>
                          <td className="p-4 font-medium text-green-600">{tx.amount.toLocaleString("fa-IR")} تومان</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${tx.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {tx.status}
                            </span>
                          </td>
                          <td className="p-4">
                            {tx.type.includes("برداشت") && (
                              <div className="flex gap-2">
                                <button onClick={() => handleApprove(tx.id)} className="px-3 py-1 bg-green-50 text-green-700 rounded-xl hover:bg-green-100">
                                  تأیید
                                </button>
                                <button onClick={() => handleReject(tx.id)} className="px-3 py-1 bg-red-50 text-red-600 rounded-xl hover:bg-red-100">
                                  رد
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}