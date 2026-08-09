'use client';

import { useState } from "react";
import {
  FiHome, FiBookOpen, FiPlusCircle, FiCalendar, FiBarChart2,
  FiMessageSquare, FiSettings, FiUpload, FiMenu
} from "react-icons/fi";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";
import { presenterMenuItems } from "@/components/layout/presenterMenuItems";

export default function NewClassPage() {
  const [activeMenu, setActiveMenu] = useState("new-class");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <Sidebar
        activeMenu="new-class"
        setActiveMenu={setActiveMenu}
        menuItems={presenterMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <PresenterHeader></PresenterHeader>

        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto">   
             <div className="mb-6 sm:mb-8 text-center sm:text-right">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">برگزاری کلاس جدید</h1>
                <p className="text-gray-500 mt-1 text-sm">اطلاعات کلاس جدید را وارد کنید</p>
             </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
            <form className="space-y-5 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">عنوان کلاس *</label>
                <input type="text" placeholder="مثال: آموزش React از صفر تا پیشرفته" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">دسته‌بندی *</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm">
                    <option>برنامه‌نویسی وب</option>
                    <option>برنامه‌نویسی موبایل</option>
                    <option>طراحی UI/UX</option>
                    <option>هوش مصنوعی</option>
                    <option>سایر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">سطح کلاس</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm">
                    <option>مبتدی</option>
                    <option>متوسط</option>
                    <option>پیشرفته</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">توضیحات کلاس</label>
                <textarea rows={4} placeholder="توضیحات کامل در مورد محتوای کلاس..." className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 resize-none text-sm" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">قیمت (تومان)</label>
                  <input type="number" placeholder="مثلاً 4500000" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">تصویر کاور کلاس</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:border-blue-400 transition cursor-pointer">
                    <FiUpload className="mx-auto text-gray-400 mb-2" size={22} />
                    <p className="text-sm text-gray-500">آپلود تصویر</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition text-sm">ایجاد کلاس</button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-sm">انصراف</button>
              </div>
            </form>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}