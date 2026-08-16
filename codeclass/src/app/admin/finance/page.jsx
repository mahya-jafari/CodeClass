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
  const [txFilter, setTxFilter] = useState("all");

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
      toast.success("برداشت رد شد");
    } catch (err) {
      toast.error("خطا در رد برداشت");
    }
  };

  const exportCSV = () => {
    if (!financeData.recentTransactions) return;
    const header = "تاریخ,نوع,مبلغ,وضعیت\n";
    const rows = financeData.recentTransactions
      .map(tx => `${tx.date},${tx.type},${tx.amount} تومان,${tx.status === "completed" ? "تکمیل‌شده" : "در انتظار"}`)
      .join("\n");
    const blob = new Blob(["\ufeff" + header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredTransactions = (financeData.recentTransactions || []).filter((tx) => {
    if (txFilter === "all") return true;
    if (txFilter === "income") return tx.type === "درآمد";
    if (txFilter === "withdraw") return tx.type === "برداشت";
    return true;
  });

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
                <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${s.color}`}>
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
                  {financeData.withdrawals?.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">درخواستی وجود ندارد</p>
                  ) : (
                    financeData.withdrawals?.map((w) => (
                      <div key={w.id} className="bg-gray-50 p-4 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-gray-800">{w.name}</p>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${w.status === "تأیید شده" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {w.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">{w.date}</p>
                          <p className="text-lg font-bold text-gray-800">{w.amount.toLocaleString("fa-IR")} تومان</p>
                        </div>
                        {w.status === "در انتظار" && (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => handleApprove(w.id)}
                              className="flex-1 flex items-center justify-center gap-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 py-1.5 rounded-lg transition"
                            >
                              <FiCheck size={13} /> تأیید
                            </button>
                            <button
                              onClick={() => handleReject(w.id)}
                              className="flex-1 flex items-center justify-center gap-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 py-1.5 rounded-lg transition"
                            >
                              <FiX size={13} /> رد
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* تراکنش‌های اخیر */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800">تراکنش‌های اخیر</h2>
                  <select
                    value={txFilter}
                    onChange={(e) => setTxFilter(e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-1 text-xs bg-white"
                  >
                    <option value="all">همه</option>
                    <option value="income">درآمد</option>
                    <option value="withdraw">برداشت</option>
                  </select>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full min-w-[420px]">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="p-3 text-right text-xs font-medium text-gray-500">تاریخ</th>
                        <th className="p-3 text-right text-xs font-medium text-gray-500">نوع</th>
                        <th className="p-3 text-right text-xs font-medium text-gray-500">مبلغ</th>
                        <th className="p-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="border-t hover:bg-gray-50">
                          <td className="p-3 text-xs text-gray-500">{tx.date}</td>
                          <td className="p-3 text-sm">{tx.type}</td>
                          <td className={`p-3 font-medium text-sm ${tx.type === "درآمد" ? "text-green-600" : "text-red-500"}`}>
                            {tx.type === "درآمد" ? "+" : "-"}{tx.amount.toLocaleString("fa-IR")}
                          </td>
                          <td className="p-3">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${tx.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {tx.status === "completed" ? "تکمیل‌شده" : "در انتظار"}
                            </span>
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