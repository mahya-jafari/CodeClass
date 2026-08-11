'use client';

import { FiBell, FiMenu } from "react-icons/fi";

/**
 * Shared header for all panels
 */
export default function AppHeader({ role = "participant", profile, onMenuClick }) {
  const defaults = {
    participant: {
      name: "سارا احمدی",
      roleLabel: "شرکت‌کننده",
      avatar: "https://via.placeholder.com/40x40?text=User",
    },
    presenter: {
      name: "سارا احمدی",
      roleLabel: "ارائه‌دهنده",
      avatar: "https://via.placeholder.com/40x40?text=User",
    },
    admin: {
      name: "مدیر سیستم",
      roleLabel: "ادمین",
      avatar: "https://via.placeholder.com/40x40?text=Admin",
    },
  };

  const fallback = defaults[role] || defaults.participant;

  const name = profile?.name || fallback.name;
  const roleLabel = profile?.role || profile?.roleLabel || fallback.roleLabel;
  const avatar = profile?.avatar || fallback.avatar;

  return (
    <header className="h-16 sm:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-600"
      >
        <FiMenu size={24} />
      </button>

      <div className="hidden lg:block" />

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700">
          <FiBell size={22} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-3">
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">{name}</p>
            <p className="text-xs text-gray-500">{roleLabel}</p>
          </div>
          <img
            src={avatar}
            alt="User"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
      </div>
    </header>
  );
}