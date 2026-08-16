'use client';

import { useState, useMemo } from "react";
import { FiSearch, FiX, FiTrash2, FiShield, FiPhone, FiCalendar, FiCheck, FiX as FiXIcon } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useGetAdminUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  useGetPendingPresentersQuery,
  useUpdatePresenterApprovalMutation,
} from "../../../store/api/adminApis";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

const TABS = [
  ["all", "همه"],
  ["participant", "شرکت‌کننده"],
  ["presenter", "ارائه‌دهنده"],
  ["admin", "مدیر"],
];

const ROLES = {
  participant: "شرکت‌کننده",
  presenter: "ارائه‌دهنده",
  admin: "مدیر سیستم",
};

const STATUS_STYLE = {
  فعال: "bg-green-100 text-green-700",
  غیرفعال: "bg-gray-100 text-gray-600",
};

export default function AdminUsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const { data: users = [], isLoading: usersLoading } = useGetAdminUsersQuery();
  const { data: pending = [], isLoading: pendingLoading } = useGetPendingPresentersQuery();
  const [updateStatus] = useUpdateUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateApproval] = useUpdatePresenterApprovalMutation();

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();
    return users.filter(u =>
      (!q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)) &&
      (role === "all" || u.role === role)
    );
  }, [users, search, role]);

  const filteredPending = useMemo(() => {
    const q = search.toLowerCase().trim();
    return pending.filter(p =>
      !q || p.name?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q)
    );
  }, [pending, search]);

  const changeStatus = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("وضعیت کاربر تغییر کرد");
    } catch {
      toast.error("خطا در تغییر وضعیت");
    }
  };

  const remove = async id => {
    if (!confirm("این کاربر برای همیشه حذف بشه؟ این عملیات قابل بازگشت نیست.")) return;
    try {
      await deleteUser(id).unwrap();
      toast.success("کاربر حذف شد");
    } catch {
      toast.error("خطا در حذف کاربر");
    }
  };

  const handleApprove = async (id) => {
    try {
      await updateApproval({ id, approvalStatus: "approved" }).unwrap();
      toast.success("ارائه‌دهنده تأیید شد");
    } catch {
      toast.error("خطا در تأیید ارائه‌دهنده");
    }
  };

  const handleReject = async (id) => {
    if (!confirm("این درخواست رد بشه؟ کاربر تا وقتی مجدداً بررسی نشه نمی‌تونه وارد بشه.")) return;
    try {
      await updateApproval({ id, approvalStatus: "rejected" }).unwrap();
      toast.success("درخواست رد شد");
    } catch {
      toast.error("خطا در رد درخواست");
    }
  };

  const isLoading = usersLoading || pendingLoading;

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar activeMenu="users" setActiveMenu={() => {}} menuItems={adminMenuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 lg:mr-64 min-w-0">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <header className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
            <p className="text-gray-500 mt-1 text-sm">مدیریت شرکت‌کنندگان، ارائه‌دهندگان و مدیران پلتفرم</p>
          </header>

          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 space-y-3">
              <div className="relative w-full max-w-md">
                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="جستجو بر اساس نام یا ایمیل..."
                  className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <FiX size={16} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {TABS.map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setRole(key)}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition ${role === key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <p className="text-center py-12 text-gray-400 text-sm">در حال بارگذاری...</p>
            ) : (
              <>
                {/* کاربران */}
                <div className="p-4 border-b border-gray-100">
                  <h2 className="font-medium text-gray-800 mb-3">کاربران</h2>
                  {filteredUsers.length === 0 ? (
                    <p className="text-center py-6 text-gray-400 text-sm">کاربری پیدا نشد</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead className="hidden md:table-header-group bg-gray-50">
                          <tr>
                            {["نام و نقش", "ایمیل", "تاریخ عضویت", "وضعیت", "عملیات"].map(x => (
                              <th key={x} className="p-4 lg:p-5 text-right text-sm">{x}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredUsers.map(u => {
                            const admin = u.role === "admin";
                            const active = u.status === "فعال";
                            return (
                              <tr key={u.id} className="block md:table-row border-t hover:bg-gray-50">
                                <td className="block md:table-cell p-4 lg:p-5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0">
                                      {u.name?.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-800 flex items-center gap-1.5">
                                        {u.name}
                                        {admin && <FiShield size={13} className="text-indigo-500" />}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {ROLES[u.role] || u.role}
                                        {u.role === "presenter" && u.approvalStatus === "pending" && (
                                          <span className="mr-2 px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px]">
                                            در انتظار تأیید
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="block md:table-cell px-4 pb-2 md:p-5 text-sm text-gray-600">
                                  <span className="md:hidden font-medium text-gray-400 ml-2">ایمیل:</span>
                                  {u.email}
                                </td>
                                <td className="block md:table-cell px-4 pb-2 md:p-5 text-sm text-gray-500">
                                  <span className="md:hidden font-medium text-gray-400 ml-2">تاریخ:</span>
                                  {u.date}
                                </td>
                                <td className="block md:table-cell px-4 pb-2 md:p-5">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLE[active ? "فعال" : "غیرفعال"]}`}>
                                    {u.status}
                                  </span>
                                </td>
                                <td className="block md:table-cell p-4 md:p-5">
                                  {admin ? (
                                    <span className="text-xs text-gray-400">بدون دسترسی تغییر</span>
                                  ) : (
                                    <div className="flex flex-wrap gap-2">
                                      <button
                                        onClick={() => changeStatus(u.id, active ? "غیرفعال" : "فعال")}
                                        className={`px-3 py-1.5 rounded-xl text-xs text-white ${active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                                      >
                                        {active ? "غیرفعال کردن" : "فعال کردن"}
                                      </button>
                                      <button
                                        onClick={() => remove(u.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                        title="حذف کاربر"
                                      >
                                        <FiTrash2 size={16} />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* ارائه‌دهندگان در انتظار */}
                <div className="p-4">
                  <h2 className="font-medium text-gray-800 mb-3">ارائه‌دهندگان در انتظار تأیید</h2>
                  {filteredPending.length === 0 ? (
                    <p className="text-center py-6 text-gray-400 text-sm">در حال حاضر درخواست در انتظاری وجود ندارد</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[700px]">
                        <thead className="hidden md:table-header-group bg-gray-50">
                          <tr>
                            {["نام", "ایمیل", "موبایل", "ثبت‌نام", "عملیات"].map(x => (
                              <th key={x} className="p-4 lg:p-5 text-right text-sm">{x}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPending.map(p => (
                            <tr key={p.id} className="block md:table-row border-t hover:bg-gray-50">
                              <td className="block md:table-cell p-4 lg:p-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium text-gray-600 shrink-0">
                                    {p.name.charAt(0)}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-800">{p.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="block md:table-cell px-4 pb-2 md:p-5 text-sm text-gray-600">
                                <span className="md:hidden font-medium text-gray-400 ml-2">ایمیل:</span>
                                {p.email}
                              </td>
                              <td className="block md:table-cell px-4 pb-2 md:p-5 text-sm text-gray-600">
                                <span className="md:hidden font-medium text-gray-400 ml-2">موبایل:</span>
                                {p.phone}
                              </td>
                              <td className="block md:table-cell px-4 pb-2 md:p-5 text-sm text-gray-500">
                                <span className="md:hidden font-medium text-gray-400 ml-2">ثبت‌نام:</span>
                                {p.date}
                              </td>
                              <td className="block md:table-cell p-4 md:p-5">
                                <div className="flex flex-wrap gap-2">
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
                                    <FiXIcon size={14} /> رد
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}