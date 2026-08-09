'use client';

import Link from "next/link";
import { FiLogOut, FiX } from "react-icons/fi";
import { FaLaptopCode } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Sidebar({ activeMenu, setActiveMenu, menuItems, isOpen, onClose }) {
  const router = useRouter();

  const handleMenuClick = (id) => {
    setActiveMenu(id);
    const routes = {
      dashboard: "/presenter/dashboard",
      "my-classes": "/presenter/my-classes",
      "new-class": "/presenter/new-class",
      webinars: "/presenter/webinars",
      pamphlets: "/presenter/pamphlets",
      calendar: "/presenter/calendar",
      reports: "/presenter/reports",
      messages: "/presenter/messages",
      settings: "/presenter/settings",
    };
    if (routes[id]) router.push(routes[id]);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-64 bg-white border-l border-gray-200 
          flex flex-col z-50 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <FaLaptopCode size={22} />
            </div>
            <span className="text-xl font-bold text-gray-800">CodeClass</span>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all relative ${
                activeMenu === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className="absolute left-4 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/login"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <FiLogOut size={20} />
            <span>خروج</span>
          </Link>
        </div>
      </aside>
    </>
  );
}