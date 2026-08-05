'use client';

import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function ConfirmModal({
  open,
  title = "آیا مطمئن هستید؟",
  description,
  confirmText = "حذف",
  cancelText = "انصراف",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <FiAlertTriangle className="text-red-500" size={22} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-base">{title}</h3>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        {description && (
          <p className="text-sm text-gray-500 leading-relaxed px-5 pt-3">
            {description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 p-5 pt-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}