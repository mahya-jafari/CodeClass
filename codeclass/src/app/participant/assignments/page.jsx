'use client';

import { useState, useRef } from "react";
import {
  FiClock, FiCheckCircle, FiAlertCircle, FiUpload, FiDownload
} from "react-icons/fi";
import ParticipantSidebar from "@/components/layout/participantSidebar";
import ParticipantHeader from "@/components/layout/participantHeader";
import { participantMenuItems } from "@/components/layout/participantMenuItems";
import {
  useGetParticipantAssignmentsQuery,
  useSubmitAssignmentMutation,
} from "../../../store/api/participantApis";

export default function ParticipantAssignments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadId, setUploadId] = useState(null);
  const fileRef = useRef(null);

  const { data: assignments = [] } = useGetParticipantAssignmentsQuery();
  const [submitAssignment] = useSubmitAssignmentMutation();

  const handleUpload = async (e) => {
    const f = e.target.files?.[0];
    if (!f || !uploadId) return;
    await submitAssignment({ id: uploadId, fileName: f.name });
    setUploadId(null);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <ParticipantSidebar
        activeMenu="assignments"
        setActiveMenu={() => {}}
        menuItems={participantMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

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
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${item.status === "done" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {item.status === "done" ? "تحویل شده" : "در انتظار"}
                  </span>

                  {/* دکمه دانلود فایل تکلیف */}
                  <a
                    href={item.fileUrl || "#"}
                    download
                    className="flex items-center gap-1.5 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 px-3.5 py-2 rounded-xl transition"
                  >
                    <FiDownload size={14} /> دانلود فایل
                  </a>

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