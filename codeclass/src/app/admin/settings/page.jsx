'use client';

import { useState, useEffect } from "react";
import { FiPlus, FiX, FiSave } from "react-icons/fi";
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from "../../../store/api/adminApis";
import { toast } from 'react-toastify';
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";

export default function AdminSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("settings");

  const { data: settings, isLoading } = useGetAdminSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateAdminSettingsMutation();

  const [form, setForm] = useState({ siteName: "", commission: 0, supportEmail: "", categories: [] });
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    if (settings) {
      setForm({
        siteName: settings.siteName || "",
        commission: settings.commission ?? 0,
        supportEmail: settings.supportEmail || "",
        categories: settings.categories || [],
      });
    }
  }, [settings]);

  const addCategory = () => {
    const value = newCategory.trim();
    if (!value || form.categories.includes(value)) return;
    setForm((f) => ({ ...f, categories: [...f.categories, value] }));
    setNewCategory("");
  };

  const removeCategory = (cat) => {
    setForm((f) => ({ ...f, categories: f.categories.filter((c) => c !== cat) }));
  };

  const handleSave = async () => {
    try {
      await updateSettings(form).unwrap();
      toast.success('تنظیمات با موفقیت ذخیره شد');
    } catch (err) {
      toast.error('خطا در ذخیره تنظیمات');
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

        <div className="p-4 sm:p-6 lg:p-8 flex flex-col items-center">
          <div className="w-full max-w-3xl mb-6 sm:mb-8 text-right">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">تنظیمات سیستم</h1>
            <p className="text-gray-500 mt-1 text-sm">مدیریت تنظیمات کلی پلتفرم</p>
          </div>

          {isLoading ? (
            <p className="text-center py-12 text-gray-500">در حال بارگذاری...</p>
          ) : (
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">اطلاعات عمومی</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">نام سایت</label>
                    <input
                      type="text"
                      value={form.siteName}
                      onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">ایمیل پشتیبانی</label>
                    <input
                      type="email"
                      value={form.supportEmail}
                      onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">درصد کمیسیون پلتفرم</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={form.commission}
                        onChange={(e) => setForm({ ...form, commission: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">٪</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">دسته‌بندی دوره‌ها</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {form.categories.map((cat) => (
                    <span key={cat} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full">
                      {cat}
                      <button onClick={() => removeCategory(cat)} className="hover:text-red-600">
                        <FiX size={13} />
                      </button>
                    </span>
                  ))}
                  {form.categories.length === 0 && (
                    <span className="text-xs text-gray-400">هنوز دسته‌بندی‌ای اضافه نشده</span>
                  )}
                </div>
                <div className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCategory()}
                    placeholder="دسته‌بندی جدید..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <button
                    onClick={addCategory}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 sm:px-8 py-2.5 rounded-xl font-medium transition text-sm"
                >
                  <FiSave size={15} />
                  {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}