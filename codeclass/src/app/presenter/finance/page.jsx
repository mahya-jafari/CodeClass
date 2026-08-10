'use client';

import { useState, useMemo } from "react";
import {
  FiDollarSign, FiTrendingUp, FiCreditCard, FiDownload,
  FiArrowUpLeft, FiArrowDownRight, FiCalendar, FiFilter,
  FiX, FiPlus, FiTrash2, FiFileText, FiBookOpen, FiVideo
} from "react-icons/fi";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";
import { presenterMenuItems } from "@/components/layout/presenterMenuItems";

export default function PresenterFinancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [bankModal, setBankModal] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [bankForm, setBankForm] = useState({ name: "", sheba: "", card: "" });

  const [banks, setBanks] = useState([
    { id: 1, name: "بانک ملت", sheba: "IR120170000000123456789001", card: "۶۱۰۴-****-****-۱۲۳۴" },
  ]);

  const transactions = [
    { id: 1, title: "فروش کلاس React پیشرفته", type: "income", source: "class", amount: 4500000, date: "۱۴۰۵/۰۲/۰۸", status: "موفق", detail: "۳ دانشجو × ۱,۵۰۰,۰۰۰" },
    { id: 2, title: "برداشت به حساب بانکی", type: "withdraw", source: "withdraw", amount: 2000000, date: "۱۴۰۵/۰۲/۰۵", status: "موفق", detail: "بانک ملت - شبا IR12..." },
    { id: 3, title: "فروش وبینار JavaScript", type: "income", source: "webinar", amount: 1800000, date: "۱۴۰۵/۰۲/۰۳", status: "موفق", detail: "۱۲ شرکت‌کننده" },
    { id: 4, title: "کمیسیون پلتفرم", type: "withdraw", source: "commission", amount: 320000, date: "۱۴۰۵/۰۲/۰۱", status: "موفق", detail: "۱۰٪ از فروش‌ها" },
  ];

  const summary = [
    { title: "موجودی قابل برداشت", value: "۱۲,۴۵۰,۰۰۰", icon: <FiDollarSign size={22} />, color: "text-green-600", bg: "bg-green-50" },
    { title: "درآمد این ماه", value: "۸,۲۰۰,۰۰۰", icon: <FiTrendingUp size={22} />, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "در انتظار تسویه", value: "۳,۱۰۰,۰۰۰", icon: <FiCreditCard size={22} />, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  const sourceLabel = { class: "کلاس", webinar: "وبینار", commission: "کمیسیون", withdraw: "برداشت" };
  const sourceIcon = {
    class: <FiBookOpen size={14} />,
    webinar: <FiVideo size={14} />,
    commission: <FiDollarSign size={14} />,
    withdraw: <FiArrowUpLeft size={14} />,
  };

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (tab === "income" && t.type !== "income") return false;
      if (tab === "withdraw" && t.type !== "withdraw") return false;
      if (sourceFilter !== "all" && t.source !== sourceFilter) return false;
      return true;
    });
  }, [tab, sourceFilter]);

  const bySource = useMemo(() => {
    const map = { class: 0, webinar: 0, commission: 0 };
    transactions.filter((t) => t.type === "income").forEach((t) => {
      if (map[t.source] !== undefined) map[t.source] += t.amount;
    });
    return map;
  }, []);

  const addBank = () => {
    if (!bankForm.name.trim() || !bankForm.sheba.trim()) return;
    setBanks((p) => [...p, { id: Date.now(), ...bankForm }]);
    setBankForm({ name: "", sheba: "", card: "" });
    setBankModal(false);
  };

  const exportCSV = () => {
    const header = "عنوان,نوع,منبع,مبلغ,تاریخ,وضعیت\n";
    const rows = filtered
      .map((t) => `${t.title},${t.type},${t.source},${t.amount},${t.date},${t.status}`)
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
      <Sidebar activeMenu="finance" setActiveMenu={() => {}} menuItems={presenterMenuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <PresenterHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">مالی</h1>
              <p className="text-gray-500 mt-1 text-sm">درآمد، برداشت، حساب بانکی و تراکنش‌ها</p>
            </div>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-2.5 rounded-xl text-sm transition">
                <FiDownload size={16} /> خروجی
              </button>
              <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition">
                <FiArrowUpLeft size={16} /> درخواست برداشت
              </button>
            </div>
          </div>

          {/* summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-6">
            {summary.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{s.title}</p>
                  <p className="text-xl font-bold text-gray-800">{s.value} <span className="text-xs font-normal text-gray-400">تومان</span></p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}>{s.icon}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* income by source */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-gray-800 text-sm mb-4">تفکیک منبع درآمد</h2>
              <div className="space-y-3">
                {[
                  { key: "class", label: "کلاس‌ها", color: "bg-blue-500" },
                  { key: "webinar", label: "وبینارها", color: "bg-purple-500" },
                ].map((s) => {
                  const total = bySource.class + bySource.webinar || 1;
                  const pct = Math.round((bySource[s.key] / total) * 100);
                  return (
                    <div key={s.key}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{s.label}</span>
                        <span className="font-medium">{bySource[s.key].toLocaleString("fa-IR")} تومان</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-2 ${s.color} rounded-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* bank accounts */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800 text-sm">حساب‌های بانکی</h2>
                <button onClick={() => setBankModal(true)} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  <FiPlus size={14} /> افزودن حساب
                </button>
              </div>
              <div className="space-y-2">
                {banks.map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <FiCreditCard size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{b.name}</p>
                      <p className="text-xs text-gray-500 truncate">{b.sheba}</p>
                      {b.card && <p className="text-xs text-gray-400">{b.card}</p>}
                    </div>
                    <button onClick={() => setBanks((p) => p.filter((x) => x.id !== b.id))} className="p-2 text-gray-400 hover:text-red-500">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                ))}
                {banks.length === 0 && <p className="text-sm text-gray-400 text-center py-4">حسابی ثبت نشده</p>}
              </div>
            </div>
          </div>

          {/* transactions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">تراکنش‌ها</h2>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                  {[
                    { id: "all", label: "همه" },
                    { id: "income", label: "درآمد" },
                    { id: "withdraw", label: "برداشت" },
                  ].map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${tab === t.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => setFilterOpen(!filterOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs ${filterOpen || sourceFilter !== "all" ? "border-blue-400 text-blue-600 bg-blue-50" : "border-gray-200 text-gray-600"}`}>
                  <FiFilter size={13} /> فیلتر
                </button>
              </div>
            </div>

            {filterOpen && (
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-3 items-end">
                <div>
                  <label className="text-[11px] text-gray-500 block mb-1">منبع</label>
                  <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white">
                    <option value="all">همه</option>
                    <option value="class">کلاس</option>
                    <option value="webinar">وبینار</option>
                    <option value="commission">کمیسیون</option>
                    <option value="withdraw">برداشت</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 block mb-1">از تاریخ</label>
                  <input value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="۱۴۰۵/۰۱/۰۱"
                    className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 w-28" />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 block mb-1">تا تاریخ</label>
                  <input value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="۱۴۰۵/۱۲/۲۹"
                    className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 w-28" />
                </div>
                <button onClick={() => { setSourceFilter("all"); setDateFrom(""); setDateTo(""); }}
                  className="text-xs text-gray-500 hover:text-red-500 px-2 py-1.5">پاک کردن</button>
              </div>
            )}

            <div className="divide-y divide-gray-100">
              {filtered.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-gray-50 transition">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === "income" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                    {tx.type === "income" ? <FiArrowDownRight size={18} /> : <FiArrowUpLeft size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-800 text-sm truncate">{tx.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><FiCalendar size={11} /> {tx.date}</span>
                      <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
                        {sourceIcon[tx.source]} {sourceLabel[tx.source]}
                      </span>
                    </div>
                  </div>
                  <div className="text-left flex items-center gap-2">
                    <div>
                      <p className={`font-bold text-sm ${tx.type === "income" ? "text-green-600" : "text-red-500"}`}>
                        {tx.type === "income" ? "+" : "−"}{tx.amount.toLocaleString("fa-IR")}
                      </p>
                      <p className={`text-[11px] ${tx.status === "موفق" ? "text-gray-400" : "text-orange-500"}`}>{tx.status}</p>
                    </div>
                    <button onClick={() => setReceipt(tx)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl" title="رسید">
                      <FiFileText size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* bank modal */}
      {bankModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setBankModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800">افزودن حساب بانکی</h3>
              <button onClick={() => setBankModal(false)}><FiX size={20} /></button>
            </div>
            <div className="space-y-3">
              <input value={bankForm.name} onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })} placeholder="نام بانک"
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-500" />
              <input value={bankForm.sheba} onChange={(e) => setBankForm({ ...bankForm, sheba: e.target.value })} placeholder="شماره شبا (IR...)"
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-500" />
              <input value={bankForm.card} onChange={(e) => setBankForm({ ...bankForm, card: e.target.value })} placeholder="شماره کارت (اختیاری)"
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <button onClick={addBank} className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium">ذخیره</button>
          </div>
        </div>
      )}

      {/* receipt modal */}
      {receipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setReceipt(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-800">رسید تراکنش</h3>
              <button onClick={() => setReceipt(null)}><FiX size={20} /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">عنوان</span><span className="font-medium text-left max-w-[60%]">{receipt.title}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">مبلغ</span><span className="font-bold">{receipt.amount.toLocaleString("fa-IR")} تومان</span></div>
              <div className="flex justify-between"><span className="text-gray-500">تاریخ</span><span>{receipt.date}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">منبع</span><span>{sourceLabel[receipt.source]}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">وضعیت</span><span className={receipt.status === "موفق" ? "text-green-600" : "text-orange-500"}>{receipt.status}</span></div>
              {receipt.detail && <div className="pt-2 border-t text-xs text-gray-500">{receipt.detail}</div>}
            </div>
            <button onClick={() => window.print()} className="w-full mt-5 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm">
              <FiDownload size={15} /> دانلود / چاپ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}