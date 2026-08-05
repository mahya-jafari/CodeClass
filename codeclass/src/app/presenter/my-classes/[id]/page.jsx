'use client';

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FiHome, FiBookOpen, FiPlusCircle, FiCalendar, FiBarChart2,
  FiMessageSquare, FiSettings, FiUsers, FiClock, FiCalendar as FiCal,
  FiEdit2, FiTrash2, FiPlay, FiPlus, FiArrowRight
} from "react-icons/fi";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";
import ConfirmModal from "@/components/ui/ConfirmModal";

const CLASSES_DATA = {
  1: {
    id: 1,
    title: "آموزش React از صفر تا پیشرفته",
    category: "برنامه‌نویسی وب",
    students: 24,
    sessions: 18,
    status: "فعال",
    level: "متوسط تا پیشرفته",
    price: "۴,۵۰۰,۰۰۰ تومان",
    description: "در این دوره از صفر تا صد React را یاد می‌گیرید. شامل Hooks، Context، Router و پروژه‌های واقعی.",
    image: "https://via.placeholder.com/400x220?text=React",
    nextSession: "سه‌شنبه ۱۸:۰۰",
    studentsList: ["سارا احمدی", "محمد رضایی", "نگار محمدی", "علی کیانی"],
    sessionsList: [
      { id: 1, title: "مقدمه و نصب محیط", date: "۱۴۰۵/۰۱/۱۲", done: true },
      { id: 2, title: "کامپوننت‌ها و Props", date: "۱۴۰۵/۰۱/۱۵", done: true },
      { id: 3, title: "State و Lifecycle", date: "۱۴۰۵/۰۱/۱۹", done: false },
      { id: 4, title: "Hooks پیشرفته", date: "۱۴۰۵/۰۱/۲۲", done: false },
    ],
  },
  2: {
    id: 2,
    title: "جامع JavaScript",
    category: "برنامه‌نویسی وب",
    students: 31,
    sessions: 17,
    status: "فعال",
    level: "مبتدی تا متوسط",
    price: "۳,۸۰۰,۰۰۰ تومان",
    description: "آموزش کامل جاوااسکریپت مدرن از پایه تا مفاهیم پیشرفته.",
    image: "https://via.placeholder.com/400x220?text=JS",
    nextSession: "یکشنبه ۱۷:۰۰",
    studentsList: ["رضا موسوی", "مینا کریمی"],
    sessionsList: [
      { id: 1, title: "متغیرها و انواع داده", date: "۱۴۰۵/۰۱/۱۰", done: true },
      { id: 2, title: "توابع و Scope", date: "۱۴۰۵/۰۱/۱۴", done: false },
    ],
  },
  3: {
    id: 3,
    title: "Python برای مبتدیان",
    category: "برنامه‌نویسی",
    students: 18,
    sessions: 15,
    status: "فعال",
    level: "مبتدی",
    price: "۳,۲۰۰,۰۰۰ تومان",
    description: "شروع برنامه‌نویسی با پایتون به زبان ساده.",
    image: "https://via.placeholder.com/400x220?text=Python",
    nextSession: "دوشنبه ۱۹:۰۰",
    studentsList: ["حسین نوری"],
    sessionsList: [
      { id: 1, title: "نصب و اولین برنامه", date: "۱۴۰۵/۰۱/۱۱", done: true },
    ],
  },
  4: {
    id: 4,
    title: "طراحی رابط کاربری با Figma",
    category: "طراحی",
    students: 12,
    sessions: 10,
    status: "پایان‌یافته",
    level: "مبتدی",
    price: "۲,۹۰۰,۰۰۰ تومان",
    description: "طراحی UI/UX حرفه‌ای با فیگما.",
    image: "https://via.placeholder.com/400x220?text=Figma",
    nextSession: "—",
    studentsList: ["مینا احمدی"],
    sessionsList: [
      { id: 1, title: "آشنایی با فیگما", date: "۱۴۰۴/۱۲/۰۵", done: true },
    ],
  },
};

export default function ClassDetailPage() {
  const router = useRouter();
  const params = useParams();
  const classData = CLASSES_DATA[params.id];

  const [activeMenu, setActiveMenu] = useState("my-classes");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("sessions");
  const [deleteModal, setDeleteModal] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "داشبورد", icon: <FiHome size={20} /> },
    { id: "my-classes", label: "کلاس‌های من", icon: <FiBookOpen size={20} /> },
    { id: "new-class", label: "برگزاری کلاس جدید", icon: <FiPlusCircle size={20} /> },
    { id: "calendar", label: "تقویم جلسات", icon: <FiCalendar size={20} /> },
    { id: "reports", label: "گزارش‌ها", icon: <FiBarChart2 size={20} /> },
    { id: "messages", label: "پیام‌ها", icon: <FiMessageSquare size={20} />, badge: 3 },
    { id: "settings", label: "تنظیمات", icon: <FiSettings size={20} /> },
  ];

  const handleDelete = () => {
    setDeleteModal(false);
    router.push("/presenter/my-classes");
  };

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500" dir="rtl">
        کلاس پیدا نشد
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        menuItems={menuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <PresenterHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">

          {/* Top Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="h-40 sm:h-52 bg-gray-100">
              <img
                src={classData.image}
                alt={classData.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        classData.status === "فعال"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {classData.status}
                    </span>
                    <span className="text-xs text-gray-500">{classData.category}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {classData.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-2xl">
                    {classData.description}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => router.push(`/presenter/classroom/${classData.id}`)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition"
                  >
                    <FiPlay size={16} /> شروع کلاس
                  </button>
                  <button className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition">
                    <FiEdit2 size={16} /> ویرایش
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { icon: <FiUsers size={18} />, label: "دانشجو", value: classData.students },
                  { icon: <FiBookOpen size={18} />, label: "جلسات", value: classData.sessions },
                  { icon: <FiCal size={18} />, label: "جلسه بعد", value: classData.nextSession },
                  { icon: <FiClock size={18} />, label: "سطح", value: classData.level },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-center gap-3">
                    <div className="text-blue-600">{item.icon}</div>
                    <div>
                      <p className="text-[11px] text-gray-500">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-100">
              {[
                { id: "sessions", label: "جلسات" },
                { id: "students", label: "دانشجویان" },
                { id: "info", label: "اطلاعات" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3.5 text-sm font-medium transition relative ${
                    activeTab === tab.id
                      ? "text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6">
              {activeTab === "sessions" && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800 text-sm">لیست جلسات</h3>
                    <button className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                      <FiPlus size={14} /> جلسه جدید
                    </button>
                  </div>
                  {classData.sessionsList.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{s.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.date}</p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          s.done
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {s.done ? "برگزار شده" : "آینده"}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "students" && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 text-sm mb-3">
                    دانشجویان ({classData.studentsList.length})
                  </h3>
                  {classData.studentsList.map((name, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                        {name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-800">{name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "info" && (
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">قیمت دوره</span>
                    <span className="font-medium text-gray-800">{classData.price}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">سطح</span>
                    <span className="font-medium text-gray-800">{classData.level}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">دسته‌بندی</span>
                    <span className="font-medium text-gray-800">{classData.category}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">وضعیت</span>
                    <span className="font-medium text-gray-800">{classData.status}</span>
                  </div>

                  <button
                    onClick={() => setDeleteModal(true)}
                    className="mt-4 flex items-center gap-2 text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-xl text-sm transition"
                  >
                    <FiTrash2 size={16} /> حذف کلاس
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        open={deleteModal}
        title="حذف کلاس"
        description={`آیا از حذف کلاس «${classData.title}» مطمئن هستید؟ این عمل قابل بازگشت نیست.`}
        confirmText="بله، حذف شود"
        cancelText="انصراف"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal(false)}
      />
    </div>
  );
}