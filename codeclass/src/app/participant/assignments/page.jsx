'use client';

import { useState, useRef } from "react";
import {
  FiHome, FiBookOpen, FiCalendar, FiFileText, FiAward,
  FiMessageSquare, FiSettings, FiClock, FiCheckCircle, FiAlertCircle, FiUpload, FiX
} from "react-icons/fi";
import ParticipantSidebar from "@/components/layout/participantSidebar";
import ParticipantHeader from "@/components/layout/participantHeader";

export default function ParticipantAssignments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assignments, setAssignments] = useState([
    { id: 1, title: "پروژه نهایی React", course: "آموزش React از صفر تا پیشرفته", deadline: "۳ روز دیگر", status: "pending" },
    { id: 2, title: "تمرین Async/Await", course: "جامع JavaScript", deadline: "۵ روز دیگر", status: "pending" },
    { id: 3, title: "ساخت API با FastAPI", course: "Python برای مبتدیان", deadline: "۱ هفته دیگر", status: "pending" },
    { id: 4, title: "کامپوننت‌های قابل استفاده مجدد", course: "آموزش React از صفر تا پیشرفته", deadline: "تحویل شده", status: "done" },
  ]);
  const [uploadId, setUploadId] = useState(null);
  const fileRef = useRef(null);

  const menuItems = [
    { id: "dashboard", label: "داشبورد", icon: <FiHome size={20} /> },
    { id: "my-classes", label: "کلاس‌های من", icon: <FiBookOpen size={20} /> },
    { id: "calendar", label: "تقویم جلسات", icon: <FiCalendar size={20} /> },
    { id: "assignments", label: "تکالیف من", icon: <FiFileText size={20} /> },
    { id: "certificates", label: "گواهینامه‌ها", icon: <FiAward size={20} /> },
    { id: "messages", label: "پیام‌ها", icon: <FiMessageSquare size={20} />, badge: 2 },
    { id: "settings", label: "تنظیمات", icon: <FiSettings size={20} /> },
  ];

  const handleUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f || !uploadId) return;
    setAssignments((prev) =>
      prev.map((a) => a.id === uploadId ? { ...a, status: "done", deadline: "تحویل شده", fileName: f.name } : a)
    );
    setUploadId(null);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <ParticipantSidebar activeMenu="assignments" setActiveMenu={() => {}} menuItems={menuItems} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <ParticipantHeader onMenuClick={() => setSidebarOpen(true)} />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">تکالیف من</h1>
            <p className="text-gray-500 mt-1 text-sm">لیست تکالیف و پروژه‌های کلاس‌ها</p>
          </div>

          <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} />

          <div className="space-y-4">
            {assignments.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.status === "done" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}>
                    {item.status === "done" ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{item.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.course}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <FiClock size={13} />
                      <span>{item.deadline}</span>
                      {item.fileName && <span className="text-blue-600">• {item.fileName}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.status === "done" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {item.status === "done" ? "تحویل شده" : "در انتظار"}
                  </span>
                  {item.status !== "done" && (
                    <button
                      onClick={() => { setUploadId(item.id); fileRef.current?.click(); }}
                      className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
                    >
                      <FiUpload size={14} /> ارسال تکلیف
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}