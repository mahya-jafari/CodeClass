'use client';

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  FiHome, FiBookOpen, FiPlusCircle, FiCalendar, FiBarChart2,
  FiMessageSquare, FiSettings, FiSearch, FiFilter, FiUsers,
  FiClock, FiPlus, FiX, FiTrash2
} from "react-icons/fi";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { presenterMenuItems } from "@/components/layout/presenterMenuItems";

export default function MyClassesPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("my-classes");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });

  const [classes, setClasses] = useState([
    { id: 1, title: "آموزش React از صفر تا پیشرفته", category: "برنامه‌نویسی وب", students: 24, sessions: 18, status: "فعال", image: "https://via.placeholder.com/80x80?text=React", color: "bg-blue-100" },
    { id: 2, title: "جامع JavaScript", category: "برنامه‌نویسی وب", students: 31, sessions: 17, status: "فعال", image: "https://via.placeholder.com/80x80?text=JS", color: "bg-yellow-100" },
    { id: 3, title: "Python برای مبتدیان", category: "برنامه‌نویسی", students: 18, sessions: 15, status: "فعال", image: "https://via.placeholder.com/80x80?text=Python", color: "bg-green-100" },
    { id: 4, title: "طراحی رابط کاربری با Figma", category: "طراحی", students: 12, sessions: 10, status: "پایان‌یافته", image: "https://via.placeholder.com/80x80?text=Figma", color: "bg-purple-100" },
  ]);

  const normalize = (text) =>
    text.toLowerCase().replace(/آ/g, "ا").replace(/أ|إ|ؤ|ئ/g, "ا").trim();

  const filteredClasses = useMemo(() => {
    const q = normalize(search);
    return classes.filter((cls) => {
      const matchSearch =
        !q ||
        normalize(cls.title).includes(q) ||
        normalize(cls.category).includes(q);
      const matchStatus =
        statusFilter === "all" || cls.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, classes]);

  const openDeleteModal = (id, title) => {
    setDeleteModal({ open: true, id, title });
  };

  const confirmDelete = () => {
    setClasses((prev) => prev.filter((c) => c.id !== deleteModal.id));
    setDeleteModal({ open: false, id: null, title: "" });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <Sidebar
        activeMenu="my-classes"
        setActiveMenu={setActiveMenu}
        menuItems={presenterMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <PresenterHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">کلاس‌های من</h1>
              <p className="text-gray-500 mt-1 text-sm">مدیریت تمام کلاس‌های برگزار شده و در حال اجرا</p>
            </div>
            <button
              onClick={() => router.push("/presenter/new-class")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition text-sm"
            >
              <FiPlus size={18} /> برگزاری کلاس جدید
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو در کلاس‌ها..."
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-sm transition ${
                  statusFilter !== "all"
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FiFilter /> فیلتر
                {statusFilter !== "all" && (
                  <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">1</span>
                )}
              </button>

              {filterOpen && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {[
                    { value: "all", label: "همه کلاس‌ها" },
                    { value: "فعال", label: "فعال" },
                    { value: "پایان‌یافته", label: "پایان‌یافته" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setStatusFilter(item.value);
                        setFilterOpen(false);
                      }}
                      className={`w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50 transition ${
                        statusFilter === item.value
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-3">{filteredClasses.length} کلاس پیدا شد</p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {filteredClasses.length === 0 ? (
              <div className="py-16 text-center text-gray-400">
                <p className="text-sm">کلاسی با این مشخصات پیدا نشد</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 px-4 sm:px-6 py-4 sm:py-5 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 ${cls.color}`}>
                        <img src={cls.image} alt={cls.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{cls.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{cls.category}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><FiUsers size={13} /> {cls.students} دانشجو</span>
                          <span className="flex items-center gap-1"><FiClock size={13} /> {cls.sessions} جلسه</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          cls.status === "فعال"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {cls.status}
                      </span>

                      <button
                        onClick={() => router.push(`/presenter/my-classes/${cls.id}`)}
                        className="text-xs sm:text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition"
                      >
                        مدیریت کلاس
                      </button>

                      <button
                        onClick={() => openDeleteModal(cls.id, cls.title)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                        title="حذف کلاس"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <ConfirmModal
        open={deleteModal.open}
        title="حذف کلاس"
        description={`آیا از حذف کلاس «${deleteModal.title}» مطمئن هستید؟ این عمل قابل بازگشت نیست.`}
        confirmText="بله، حذف شود"
        cancelText="انصراف"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, title: "" })}
      />
    </div>
  );
}