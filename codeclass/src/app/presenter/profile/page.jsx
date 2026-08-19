'use client';

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";
import { presenterMenuItems } from "@/components/layout/presenterMenuItems";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "../../../store/api/presenterApis";

export default function PresenterProfile() {
  const [activeMenu, setActiveMenu] = useState("settings");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: profile } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    await updateProfile(form);
    if (passwords.new && passwords.new === passwords.confirm) {
      await changePassword(passwords);
      setPasswords({ current: "", new: "", confirm: "" });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <Sidebar
        activeMenu="settings"
        setActiveMenu={setActiveMenu}
        menuItems={presenterMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <PresenterHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 sm:mb-8 text-center sm:text-right">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">پروفایل من</h1>
              <p className="text-gray-500 mt-1 text-sm">مدیریت حساب کاربری </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-6 sm:space-y-8">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">اطلاعات پروفایل</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">نام و نام خانوادگی</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">ایمیل</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">شماره موبایل</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              <hr />

              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">تغییر رمز عبور</h2>
                <div className="space-y-4 max-w-md">
                  <input
                    type="password"
                    placeholder="رمز عبور فعلی"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <input
                    type="password"
                    placeholder="رمز عبور جدید"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <input
                    type="password"
                    placeholder="تکرار رمز عبور جدید"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 rounded-xl font-medium transition text-sm"
                >
                  ذخیره تغییرات
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}