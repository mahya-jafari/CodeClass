import {
  FiHome, FiBookOpen, FiVideo, FiFileText, FiCalendar, FiAward, FiMessageSquare, FiUser, FiDollarSign
} from "react-icons/fi";

export const participantMenuItems = [
  { id: "dashboard", label: "داشبورد", icon: <FiHome size={20} /> },
  { id: "profile", label: "پروفایل", icon: <FiUser size={20} /> },
  { id: "my-classes", label: "کلاس‌های من", icon: <FiBookOpen size={20} /> },
  { id: "webinars", label: "وبینارها", icon: <FiVideo size={20} /> },
  { id: "assignments", label: "تکالیف من", icon: <FiFileText size={20} /> },
  { id: "pamphlets", label: "جزوات درسی", icon: <FiFileText size={20} /> },
  { id: "calendar", label: "تقویم جلسات", icon: <FiCalendar size={20} /> },
  { id: "certificates", label: "گواهینامه‌ها", icon: <FiAward size={20} /> },
  { id: "messages", label: "پیام‌ها", icon: <FiMessageSquare size={20} />, badge: 2 },
  { id: "finance", label: "مالی", icon: <FiDollarSign size={20} /> },
];