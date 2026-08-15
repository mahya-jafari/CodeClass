'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FiArrowRight, FiSend, FiCheckCircle, FiRotateCcw, FiTrash2,
} from "react-icons/fi";
import AdminSidebar from "@/components/layout/adminSidebar";
import AdminHeader from "@/components/layout/adminHeader";
import { adminMenuItems } from "@/components/layout/adminMenuItems";
import {
  useGetAdminMessagesQuery,
  useGetAdminMessageThreadQuery,
  useSendAdminMessageReplyMutation,
  useUpdateMessageStatusMutation,
  useDeleteAdminMessageMutation,
} from "../../../../store/api/adminApis";
import { toast } from 'react-toastify';

export default function AdminMessageChatPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const { data: messages = [] } = useGetAdminMessagesQuery();
  const conversation = messages.find((m) => String(m.id) === String(id));

  const { data: thread = [], isLoading } = useGetAdminMessageThreadQuery(id);
  const [sendReply, { isLoading: isSending }] = useSendAdminMessageReplyMutation();
  const [updateStatus] = useUpdateMessageStatusMutation();
  const [deleteMessage] = useDeleteAdminMessageMutation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await sendReply({ id, text: text.trim() }).unwrap();
      setText("");
    } catch (err) {
      toast.error('خطا در ارسال پیام');
    }
  };

  const toggleStatus = async () => {
    const nextStatus = conversation?.status === "resolved" ? "pending" : "resolved";
    try {
      await updateStatus({ id, status: nextStatus }).unwrap();
      toast.success(nextStatus === "resolved" ? 'گفتگو به‌عنوان حل‌شده علامت خورد' : 'گفتگو به در انتظار برگشت');
    } catch (err) {
      toast.error('خطا در تغییر وضعیت');
    }
  };

  const handleDelete = async () => {
    if (!confirm('این گفتگو حذف بشه؟ این عملیات قابل بازگشت نیست.')) return;
    try {
      await deleteMessage(id).unwrap();
      toast.success('گفتگو حذف شد');
      router.push('/admin/messages');
    } catch (err) {
      toast.error('خطا در حذف گفتگو');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex" dir="rtl">
      <AdminSidebar
        activeMenu="messages"
        setActiveMenu={() => {}}
        menuItems={adminMenuItems}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 lg:mr-64 transition-all duration-300 flex flex-col h-screen">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <header className="h-14 sm:h-16 bg-white border-b flex items-center gap-3 px-4 sm:px-6 flex-shrink-0">
          <button
            onClick={() => router.push("/admin/messages")}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            <FiArrowRight size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
            {conversation?.name?.charAt(0) || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-800 text-sm truncate">{conversation?.name || "کاربر"}</h2>
            <p className="text-xs text-gray-500">کاربر پلتفرم</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleStatus}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition ${
                conversation?.status === "resolved"
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              {conversation?.status === "resolved" ? (
                <>
                  <FiRotateCcw size={13} /> بازگشایی
                </>
              ) : (
                <>
                  <FiCheckCircle size={13} /> علامت به‌عنوان حل‌شده
                </>
              )}
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition"
              title="حذف گفتگو"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </header>

        {conversation?.status === "resolved" && (
          <div className="bg-green-50 text-green-700 text-xs text-center py-2 flex-shrink-0">
            این گفتگو به‌عنوان حل‌شده علامت‌گذاری شده است
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-400 text-sm">در حال بارگذاری...</div>
          ) : thread.length === 0 ? (
            <div className="text-center text-gray-400 text-sm">هنوز پیامی ارسال نشده</div>
          ) : (
            thread.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.fromMe ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-2.5 ${
                    msg.fromMe
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white border border-gray-100 text-gray-800 rounded-bl-md"
                  }`}
                >
                  {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                  <p className={`text-[10px] mt-1 ${msg.fromMe ? "text-blue-100" : "text-gray-400"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* mobile status action */}
        <div className="sm:hidden px-4 pb-2 flex-shrink-0">
          <button
            onClick={toggleStatus}
            className={`w-full flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl transition ${
              conversation?.status === "resolved"
                ? "bg-gray-100 text-gray-600"
                : "bg-green-50 text-green-700"
            }`}
          >
            {conversation?.status === "resolved" ? (
              <>
                <FiRotateCcw size={13} /> بازگشایی گفتگو
              </>
            ) : (
              <>
                <FiCheckCircle size={13} /> علامت به‌عنوان حل‌شده
              </>
            )}
          </button>
        </div>

        <div className="bg-white border-t p-3 sm:p-4 flex items-center gap-2 flex-shrink-0">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="پاسخ خود را بنویسید..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={isSending}
            className="w-11 h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl flex items-center justify-center transition flex-shrink-0"
          >
            <FiSend size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}