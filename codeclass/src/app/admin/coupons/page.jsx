'use client';

import { useState, useMemo } from "react";
import { FiSearch, FiX, FiPlus, FiTag, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useGetAdminCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponStatusMutation,
  useDeleteCouponMutation,
} from "../../../store/api/adminApis";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";
import ConfirmModal from "@/components/ui/ConfirmModal";

const STATUS_STYLE = {
  "فعال": "bg-green-100 text-green-700",
  "غیرفعال": "bg-gray-100 text-gray-600",
  "منقضی شده": "bg-red-100 text-red-700",
};

export default function AdminCouponsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("coupons");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percent", value: "", maxUses: "", expiresAt: "" });
  const [deleteId, setDeleteId] = useState(null);

  const { data: coupons = [], isLoading } = useGetAdminCouponsQuery();
  const [createCoupon] = useCreateCouponMutation();
  const [updateStatus] = useUpdateCouponStatusMutation();
  const [deleteCoupon] = useDeleteCouponMutation();

  const filtered = useMemo(() => coupons, [coupons]); 

  const handleCreate = async () => {
    if (!form.code.trim() || !form.value || !form.maxUses) {
      toast.error('کد، مقدار تخفیف و سقف استفاده را وارد کنید');
      return;
    }
    await createCoupon(form).unwrap();
    toast.success('کد تخفیف ایجاد شد');
    setForm({ code: "", type: "percent", value: "", maxUses: "", expiresAt: "" });
    setShowForm(false);
  };

  const handleToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "فعال" ? "غیرفعال" : "فعال";
    await updateStatus({ id, status: newStatus }).unwrap();
    toast.success('وضعیت کد تخفیف تغییر کرد');
  };

  const openDeleteConfirm = (id) => setDeleteId(id);
  const handleDelete = () => {
    deleteCoupon(deleteId).unwrap();
    toast.success('کد تخفیف حذف شد');
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} menuItems={adminMenuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 lg:mr-64 min-w-0">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">کدهای تخفیف</h1>
              <p className="text-gray-500 mt-1 text-sm">ایجاد و مدیریت کدهای تخفیف پلتفرم</p>
            </div>
            <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm transition">
              {showForm ? <FiX size={16} /> : <FiPlus size={16} />}
              {showForm ? "انصراف" : "کد تخفیف جدید"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-1"><label className="block text-xs text-gray-500 mb-1.5">کد تخفیف</label><input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME20" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm" dir="ltr" /></div>
                <div><label className="block text-xs text-gray-500 mb-1.5">نوع تخفیف</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white">
                    <option value="percent">درصدی</option>
                    <option value="fixed">مبلغ ثابت</option>
                  </select>
                </div>
                <div><label className="block text-xs text-gray-500 mb-1.5">مقدار {form.type === "percent" ? "(٪)" : "(تومان)"}</label><input type="number" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm" /></div>
                <div><label className="block text-xs text-gray-500 mb-1.5">سقف استفاده</label><input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm" /></div>
                <div><label className="block text-xs text-gray-500 mb-1.5">تاریخ انقضا</label><input type="text" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} placeholder="۱۴۰۵/۰۴/۰۱" className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm" /></div>
              </div>
              <button type="submit" className="mt-4 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm transition">ایجاد کد تخفیف</button>
            </form>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {isLoading ? (
              <p className="text-center py-12 text-gray-400 text-sm">در حال بارگذاری...</p>
            ) : coupons.length === 0 ? (
              <p className="text-center py-12 text-gray-400 text-sm">هنوز کد تخفیفی ثبت نشده</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="hidden md:table-header-group bg-gray-50">
                    <tr>
                      {["کد", "تخفیف", "استفاده", "انقضا", "وضعیت", "عملیات"].map(x => <th key={x} className="p-4 lg:p-5 text-right text-sm">{x}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(c => (
                      <tr key={c.id} className="block md:table-row border-t hover:bg-gray-50">
                        <td className="block md:table-cell p-4 lg:p-5">
                          <div className="flex items-center gap-2 font-mono font-medium text-gray-800" dir="ltr">
                            <FiTag size={14} className="text-indigo-500" />
                            {c.code}
                          </div>
                        </td>
                        <td className="block md:table-cell px-4 pb-2 md:p-5 text-gray-600 text-sm">
                          {c.type === "percent" ? `${c.value}٪` : `${c.value.toLocaleString("fa-IR")} تومان`}
                        </td>
                        <td className="block md:table-cell px-4 pb-2 md:p-5 text-sm text-gray-600">{c.usedCount} / {c.maxUses}</td>
                        <td className="block md:table-cell px-4 pb-2 md:p-5 text-sm text-gray-500">{c.expiresAt}</td>
                        <td className="block md:table-cell px-4 pb-2 md:p-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[c.status] || "bg-gray-100 text-gray-600"}`}>{c.status}</span>
                        </td>
                        <td className="block md:table-cell p-4 md:p-5">
                          {c.status === "منقضی شده" ? (
                            <button onClick={() => openDeleteConfirm(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="حذف"><FiTrash2 size={16} /></button>
                          ) : (
                            <div className="flex gap-2">
                              <button onClick={() => handleToggle(c.id, c.status)} className={`px-3 py-1.5 rounded-xl text-xs transition ${c.status === "فعال" ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"}`}>
                                {c.status === "فعال" ? "غیرفعال کردن" : "فعال کردن"}
                              </button>
                              <button onClick={() => openDeleteConfirm(c.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition" title="حذف"><FiTrash2 size={16} /></button>
                            </div>
                          )}
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

      <ConfirmModal
        open={!!deleteId}
        title="حذف کد تخفیف"
        description={`آیا مطمئن هستید که می‌خواهید کد تخفیف «${coupons.find(c => c.id === deleteId)?.code}» را حذف کنید؟`}
        confirmText="حذف"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}