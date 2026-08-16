'use client';

import { useState } from "react";
import { FiCheck, FiX, FiMail, FiPhone, FiCalendar } from "react-icons/fi";
import {
  useGetPendingPresentersQuery,
  useUpdatePresenterApprovalMutation,
} from "../../../store/api/adminApis";
import { toast } from 'react-toastify';
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

export default function AdminPresenterApprovalsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("presenter-approvals");

  const { data: pending = [], isLoading } = useGetPendingPresentersQuery();
  const [updateApproval] = useUpdatePresenterApprovalMutation();

  const handleApprove = async (id) => {
    try {
      await updateApproval({ id, approvalStatus: "approved" }).unwrap();
      toast.success('ارائه‌دهنده تأیید شد');
    } catch (err) {
      toast.error('خطا در تأیید ارائه‌دهنده');
    }
  };

  const handleReject = async (id) => {
    if (!confirm('این درخواست رد بشه؟ کاربر تا وقتی مجدداً بررسی نشه نمی‌تونه وارد بشه.')) return;
    try {
      await updateApproval({ id, approvalStatus: "rejected" }).unwrap();
      toast.success('درخواست رد شد');
    } catch (err) {
      toast.error('خطا در رد درخواست');
    }
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">تأیید ارائه‌دهندگان</h1>
            <p className="text-gray-500 mt-1 text-sm">
              درخواست‌های ثبت‌نام مدرسین که منتظر بررسی شما هستند
              {pending.length > 0 && (
                <span className="mr-1 text-orange-600 font-medium">({pending.length} درخواست)</span>
              )}
            </p>
          </div>

          {isLoading ? (
            <p className="text-center py-12 text-gray-400 text-sm">در حال بارگذاری...</p>
          ) : pending.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-400 text-sm">در حال حاضر درخواست در انتظاری وجود ندارد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {pending.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold flex-shrink-0">
                      {p.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-800 text-sm truncate">{p.name}</h3>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                        در انتظار تأیید
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-gray-500 mb-5">
                    <div className="flex items-center gap-2">
                      <FiMail size={13} />
                      <span dir="ltr">{p.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhone size={13} />
                      <span dir="ltr">{p.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar size={13} />
                      <span>ثبت‌نام: {p.date}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(p.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition"
                    >
                      <FiCheck size={14} /> تأیید
                    </button>
                    <button
                      onClick={() => handleReject(p.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl transition"
                    >
                      <FiX size={14} /> رد
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}