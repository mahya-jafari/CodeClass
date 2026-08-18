'use client';

import { FiX } from "react-icons/fi";

export default function SettingsModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-gray-800">
            تنظیمات کلاس
          </h3>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="space-y-4 text-sm">

          <label className="flex items-center justify-between">
            <span>صدای کلاس</span>
            <input
              type="checkbox"
              defaultChecked
              className="accent-blue-600"
            />
          </label>

          <label className="flex items-center justify-between">
            <span>کیفیت ویدیو</span>
            <select className="border rounded-lg px-2 py-1 text-xs">
              <option>خودکار</option>
              <option>بالا</option>
              <option>متوسط</option>
              <option>پایین</option>
            </select>
          </label>

        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium"
        >
          ذخیره
        </button>
      </div>
    </div>
  );
}