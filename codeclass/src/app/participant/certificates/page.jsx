'use client';

import { useState } from "react";
import { FiAward, FiDownload } from "react-icons/fi";
import ParticipantSidebar from "@/components/layout/participantSidebar";
import ParticipantHeader from "@/components/layout/participantHeader";
import { participantMenuItems } from "@/components/layout/participantMenuItems";
import { useGetParticipantCertificatesQuery } from "../../../store/api/participantApis";

export default function ParticipantCertificates() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: certificates = [] } = useGetParticipantCertificatesQuery();

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <ParticipantSidebar
        activeMenu="certificates"
        setActiveMenu={() => {}}
        menuItems={participantMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300">
        <ParticipantHeader onMenuClick={() => setSidebarOpen(true)} />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">گواهینامه‌ها</h1>
            <p className="text-gray-500 mt-1 text-sm">گواهینامه‌های دوره‌های تکمیل‌شده شما</p>
          </div>

          {certificates.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <FiAward size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">هنوز گواهینامه‌ای دریافت نکرده‌اید</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {certificates.map((cert) => (
                <div key={cert.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  <div className="h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <FiAward size={48} className="text-blue-500" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">{cert.title}</h3>
                    <p className="text-xs text-gray-500 mb-1">{cert.instructor}</p>
                    <p className="text-xs text-gray-400 mb-4">{cert.date}</p>
                    <button className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2.5 rounded-xl text-sm font-medium transition">
                      <FiDownload size={16} /> دانلود گواهینامه
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