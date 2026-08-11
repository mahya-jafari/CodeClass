'use client';

import { useState } from "react";
import {
  FiDollarSign, FiCreditCard, FiDownload, FiCalendar, FiCheckCircle,
  FiX, FiPlus, FiRefreshCw, FiAlertCircle
} from "react-icons/fi";
import ParticipantSidebar from "@/components/layout/participantSidebar";
import ParticipantHeader from "@/components/layout/participantHeader";
import { participantMenuItems } from "@/components/layout/participantMenuItems";
import {
  useGetParticipantFinanceQuery,
  useChargeWalletMutation,
  useRetryPaymentMutation,
} from "../../../store/api/participantApis";

export default function ParticipantFinancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chargeOpen, setChargeOpen] = useState(false);
  const [chargeAmount, setChargeAmount] = useState("");
  const [retryModal, setRetryModal] = useState(null);
  const [invoice, setInvoice] = useState(null);

  const { data } = useGetParticipantFinanceQuery();
  const [chargeWalletMutation] = useChargeWalletMutation();
  const [retryPaymentMutation] = useRetryPaymentMutation();

  const wallet = data?.wallet ?? 0;
  const payments = data?.payments ?? [];
  const summary = data?.summary ?? [];

  const methodStyle = {
    "درگاه بانکی": "bg-blue-50 text-blue-600",
    "کیف پول": "bg-purple-50 text-purple-600",
    "رایگان": "bg-green-50 text-green-600",
  };

  const chargeWallet = async () => {
    const amount = Number(chargeAmount);
    if (!amount || amount < 1000) return;
    await chargeWalletMutation({ amount });
    setChargeAmount("");
    setChargeOpen(false);
  };

  const retryPayment = async () => {
    if (!retryModal) return;
    await retryPaymentMutation(retryModal.id);
    setRetryModal(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <ParticipantSidebar activeMenu="finance" setActiveMenu={() => {}} menuItems={participantMenuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <ParticipantHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">مالی</h1>
              <p className="text-gray-500 mt-1 text-sm">کیف پول، پرداخت‌ها و فاکتورها</p>
            </div>
            <button
              onClick={() => setChargeOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
            >
              <FiPlus size={16} /> شارژ کیف پول
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-6">
            {summary.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{s.title}</p>
                  <p className="text-xl font-bold text-gray-800">{s.value} <span className="text-xs font-normal text-gray-400">{s.unit}</span></p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>
                  {i === 0 ? <FiCreditCard size={22} /> : i === 1 ? <FiDollarSign size={22} /> : <FiCheckCircle size={22} />}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">تاریخچه پرداخت‌ها</h2>
            </div>

            <div className="divide-y divide-gray-100">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-gray-50 transition">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    p.status === "موفق" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                  }`}>
                    {p.status === "موفق" ? <FiCreditCard size={18} /> : <FiAlertCircle size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm truncate">{p.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><FiCalendar size={11} /> {p.date}</span>
                      <span className={`px-1.5 py-0.5 rounded ${methodStyle[p.method] || "bg-gray-100"}`}>{p.method}</span>
                    </div>
                  </div>
                  <div className="text-left flex items-center gap-1 sm:gap-2">
                    <div>
                      <p className="font-bold text-sm text-gray-800">
                        {p.amount === 0 ? "رایگان" : `${p.amount.toLocaleString("fa-IR")}`}
                      </p>
                      <p className={`text-[11px] ${p.status === "موفق" ? "text-green-600" : "text-red-500"}`}>{p.status}</p>
                    </div>
                    {p.status === "موفق" && p.amount > 0 && (
                      <button onClick={() => setInvoice(p)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl" title="فاکتور">
                        <FiDownload size={16} />
                      </button>
                    )}
                    {p.status === "ناموفق" && (
                      <button onClick={() => setRetryModal(p)}
                        className="flex items-center gap-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1.5 rounded-xl transition">
                        <FiRefreshCw size={13} /> تلاش مجدد
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {chargeOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setChargeOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800">شارژ کیف پول</h3>
              <button onClick={() => setChargeOpen(false)}><FiX size={20} /></button>
            </div>
            <p className="text-xs text-gray-500 mb-3">موجودی فعلی: {wallet.toLocaleString("fa-IR")} تومان</p>
            <input type="number" value={chargeAmount} onChange={(e) => setChargeAmount(e.target.value)}
              placeholder="مبلغ (تومان)" className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-500 mb-3" />
            <div className="flex gap-2 mb-4">
              {[100000, 200000, 500000].map((a) => (
                <button key={a} onClick={() => setChargeAmount(String(a))}
                  className="flex-1 text-xs py-2 rounded-xl border border-gray-200 hover:border-blue-400 hover:text-blue-600 transition">
                  {a.toLocaleString("fa-IR")}
                </button>
              ))}
            </div>
            <button onClick={chargeWallet} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium">
              پرداخت و شارژ
            </button>
          </div>
        </div>
      )}

      {retryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setRetryModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">تلاش مجدد پرداخت</h3>
              <button onClick={() => setRetryModal(null)}><FiX size={20} /></button>
            </div>
            <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4 flex items-start gap-2">
              <FiAlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>پرداخت «{retryModal.title}» ناموفق بود. می‌توانید دوباره تلاش کنید.</span>
            </div>
            <div className="text-sm space-y-2 mb-5">
              <div className="flex justify-between"><span className="text-gray-500">مبلغ</span><span className="font-bold">{retryModal.amount.toLocaleString("fa-IR")} تومان</span></div>
              <div className="flex justify-between"><span className="text-gray-500">روش</span><span>{retryModal.method}</span></div>
            </div>
            <button onClick={retryPayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
              <FiRefreshCw size={15} /> پرداخت مجدد
            </button>
          </div>
        </div>
      )}

      {invoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setInvoice(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800">فاکتور</h3>
              <button onClick={() => setInvoice(null)}><FiX size={20} /></button>
            </div>
            <div className="text-center mb-4 pb-4 border-b">
              <p className="text-xs text-gray-400">CodeClass</p>
              <p className="font-bold text-gray-800 mt-1">فاکتور پرداخت</p>
            </div>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between"><span className="text-gray-500">شرح</span><span className="font-medium text-left max-w-[55%]">{invoice.title}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">مبلغ</span><span className="font-bold">{invoice.amount.toLocaleString("fa-IR")} تومان</span></div>
              <div className="flex justify-between"><span className="text-gray-500">تاریخ</span><span>{invoice.date}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">روش پرداخت</span><span>{invoice.method}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">وضعیت</span><span className="text-green-600">موفق</span></div>
            </div>
            <button onClick={() => window.print()} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium">
              <FiDownload size={15} /> دانلود PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}