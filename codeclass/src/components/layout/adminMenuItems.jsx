import {
  FiHome, FiUsers, FiBookOpen, FiVideo, FiDollarSign,
  FiAward, FiMessageSquare, FiSettings, FiFileText, FiBarChart2
} from "react-icons/fi";

export const adminMenuItems = [
  { id: "dashboard", label: "داشبورد", icon: <FiHome size={20} /> },
  { id: "users", label: "مدیریت کاربران", icon: <FiUsers size={20} /> },
  { id: "classes", label: "مدیریت کلاس‌ها", icon: <FiBookOpen size={20} /> },
  { id: "webinars", label: "مدیریت وبینارها", icon: <FiVideo size={20} /> },
  { id: "finance", label: "مدیریت مالی", icon: <FiDollarSign size={20} /> },
  { id: "certificates", label: "گواهینامه‌ها", icon: <FiAward size={20} /> },
  { id: "assignments", label: "تکالیف", icon: <FiFileText size={20} /> },
  { id: "messages", label: "پیام‌ها و پشتیبانی", icon: <FiMessageSquare size={20} />, badge: 3 },
  { id: "reports", label: "گزارش‌ها", icon: <FiBarChart2 size={20} /> },
  { id: "settings", label: "تنظیمات سیستم", icon: <FiSettings size={20} /> },
];