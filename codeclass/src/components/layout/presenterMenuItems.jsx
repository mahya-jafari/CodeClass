import {
  FiHome, FiBookOpen, FiPlusCircle, FiFileText,
  FiCalendar, FiBarChart2, FiMessageSquare, FiSettings, FiVideo
} from "react-icons/fi";

export const presenterMenuItems = [
  { id: "dashboard", label: "داشبورد", icon: <FiHome size={20} /> },
  { id: "my-classes", label: "کلاس‌های من", icon: <FiBookOpen size={20} /> },
  { id: "new-class", label: "برگزاری کلاس جدید", icon: <FiPlusCircle size={20} /> },
  { id: "webinars", label: "وبینارها", icon: <FiVideo size={20} /> },
  { id: "pamphlets", label: "جزوات درسی", icon: <FiFileText size={20} /> },
  { id: "calendar", label: "تقویم جلسات", icon: <FiCalendar size={20} /> },
  { id: "reports", label: "گزارش‌ها", icon: <FiBarChart2 size={20} /> },
  { id: "messages", label: "پیام‌ها", icon: <FiMessageSquare size={20} />, badge: 3 },
  { id: "settings", label: "تنظیمات", icon: <FiSettings size={20} /> },
];