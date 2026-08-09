'use client';

import { useState, useRef, useMemo } from "react";
import {
  FiHome, FiBookOpen, FiPlusCircle, FiCalendar, FiBarChart2,
  FiMessageSquare, FiSettings, FiSearch, FiUpload, FiFile,
  FiDownload, FiTrash2, FiX, FiEye, FiFilter, FiFileText
} from "react-icons/fi";
import Sidebar from "@/components/layout/presenterSidebar";
import PresenterHeader from "@/components/layout/presenterHeader";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { presenterMenuItems } from "@/components/layout/presenterMenuItems";

export default function PamphletsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, title: "" });
  const fileRef = useRef(null);

  const classOptions = [
    "آموزش React از صفر تا پیشرفته",
    "جامع JavaScript",
    "Python برای مبتدیان",
  ];

  const [pamphlets, setpamphlets] = useState([
    {
      id: 1,
      title: "جزوه جلسه ۱ - مقدمه React",
      className: "آموزش React از صفر تا پیشرفته",
      type: "pdf",
      size: "2.4 MB",
      date: "۱۴۰۵/۰۱/۱۲",
      url: "#",
    },
    {
      id: 2,
      title: "تمرین Async/Await",
      className: "جامع JavaScript",
      type: "docx",
      size: "1.2 MB",
      date: "۱۴۰۵/۰۱/۱۰",
      url: "#",
    },
  ]);

  const normalize = (t) =>
    t.toLowerCase().replace(/آ/g, "ا").replace(/أ|إ|ؤ|ئ/g, "ا").trim();

  const filtered = useMemo(() => {
    const q = normalize(search);
    return pamphlets.filter((m) => {
      const matchSearch =
        !q || normalize(m.title).includes(q) || normalize(m.className).includes(q);
      const matchClass = classFilter === "all" || m.className === classFilter;
      return matchSearch && matchClass;
    });
  }, [search, classFilter, pamphlets]);

  /* upload handler */
  const handleUpload = (fileList) => {
    const f = fileList?.[0];
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase() || "file";
    setpamphlets((prev) => [
      {
        id: Date.now(),
        title: f.name.replace(/\.[^/.]+$/, ""),
        className: classFilter === "all" ? "بدون کلاس" : classFilter,
        type: ext,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        date: new Date().toLocaleDateString("fa-IR"),
        url: URL.createObjectURL(f),
      },
      ...prev,
    ]);
  };

  const onFileInput = (e) => {
    handleUpload(e.target.files);
    e.target.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const confirmDelete = () => {
    setpamphlets((prev) => prev.filter((m) => m.id !== deleteModal.id));
    setDeleteModal({ open: false, id: null, title: "" });
  };

  const typeStyle = (type) => {
    if (type === "pdf") return "from-red-500 to-rose-400";
    if (["doc", "docx"].includes(type)) return "from-blue-500 to-sky-400";
    if (["ppt", "pptx"].includes(type)) return "from-orange-500 to-amber-400";
    return "from-gray-500 to-gray-400";
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <Sidebar
        activeMenu="pamphlets"
        setActiveMenu={() => {}}
        menuItems={presenterMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* main area */}
      <main className="flex-1 lg:mr-64 transition-all duration-300">
        {/* center the whole page block */}
        <PresenterHeader onMenuClick={() => setSidebarOpen(true)} />
        <div className="min-h-screen flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* page title */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">جزوات درسی</h1>
                <p className="text-gray-500 mt-1 text-sm">
                  مدیریت و اشتراک‌گذاری فایل‌های آموزشی کلاس‌ها
                </p>
              </div>

              {/* stats row */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                {[
                  { label: "کل جزوات", value: pamphlets.length, color: "text-blue-600" },
                  { label: "فایل PDF", value: pamphlets.filter((m) => m.type === "pdf").length, color: "text-red-500" },
                  { label: "سایر فایل‌ها", value: pamphlets.filter((m) => m.type !== "pdf").length, color: "text-purple-500" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center"
                  >
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* search + filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                  <FiSearch
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="جستجو در عنوان یا کلاس..."
                    className="w-full pr-10 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 text-sm transition"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={15} />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className={`flex items-center gap-2 px-4 py-2.5 bg-white border rounded-xl text-sm transition w-full sm:w-auto justify-center ${
                      classFilter !== "all"
                        ? "border-blue-400 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <FiFilter size={15} />
                    {classFilter === "all"
                      ? "همه کلاس‌ها"
                      : classFilter.slice(0, 18) + (classFilter.length > 18 ? "…" : "")}
                  </button>

                  {filterOpen && (
                    <div className="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-20 overflow-hidden">
                      <button
                        onClick={() => {
                          setClassFilter("all");
                          setFilterOpen(false);
                        }}
                        className={`w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50 ${
                          classFilter === "all"
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        همه کلاس‌ها
                      </button>
                      {classOptions.map((c) => (
                        <button
                          key={c}
                          onClick={() => {
                            setClassFilter(c);
                            setFilterOpen(false);
                          }}
                          className={`w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50 truncate ${
                            classFilter === c
                              ? "bg-blue-50 text-blue-600 font-medium"
                              : "text-gray-700"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* pamphlets cards */}
              <div className="space-y-3 mb-8">
                {filtered.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gray-50 flex items-center justify-center">
                      <FiFileText size={26} className="text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400">جزوه‌ای پیدا نشد</p>
                  </div>
                ) : (
                  filtered.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                      {/* icon + info */}
                      <div className="flex items-center gap-3.5 flex-1 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeStyle(m.type)} flex items-center justify-center text-white shadow-sm flex-shrink-0`}
                        >
                          <FiFile size={20} />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-[15px] truncate">
                            {m.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{m.className}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">
                              {m.type}
                            </span>
                            <span className="text-[11px] text-gray-400">{m.size}</span>
                            <span className="text-[11px] text-gray-300">|</span>
                            <span className="text-[11px] text-gray-400">{m.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* actions */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 px-3.5 py-2 rounded-xl transition"
                        >
                          <FiEye size={14} /> مشاهده
                        </a>
                        <a
                          href={m.url}
                          download
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                          title="دانلود"
                        >
                          <FiDownload size={16} />
                        </a>
                        <button
                          onClick={() =>
                            setDeleteModal({ open: true, id: m.id, title: m.title })
                          }
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                          title="حذف"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* upload drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`
                  relative rounded-2xl border-2 border-dashed p-10 sm:p-12 text-center cursor-pointer transition-all
                  ${
                    dragOver
                      ? "border-blue-400 bg-blue-50 scale-[1.01]"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                  }
                `}
              >
                <div
                  className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition ${
                    dragOver ? "bg-blue-100" : "bg-gray-50"
                  }`}
                >
                  <FiUpload size={24} className={dragOver ? "text-blue-600" : "text-gray-400"} />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {dragOver
                    ? "فایل را رها کنید"
                    : "برای آپلود جزوه کلیک کنید یا فایل را بکشید"}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  PDF · Word · PowerPoint · ZIP — حداکثر ۲۰ مگابایت
                </p>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                  className="hidden"
                  onChange={onFileInput}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* delete modal */}
      <ConfirmModal
        open={deleteModal.open}
        title="حذف جزوه"
        description={`آیا از حذف «${deleteModal.title}» مطمئن هستید؟`}
        confirmText="بله، حذف شود"
        cancelText="انصراف"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, id: null, title: "" })}
      />
    </div>
  );
}