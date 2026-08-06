'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";

import Toolbar from "@/components/classroom/participant/Toolbar";
import Sidebar from "@/components/classroom/participant/Sidebar";
import Whiteboard from "@/components/classroom/participant/Whiteboard";
import IDEPanel, { useIDE } from "@/components/classroom/participant/IDEPanel";
import BottomBar from "@/components/classroom/participant/BottomBar";
import NewFileModal from "@/components/classroom/participant/NewFileModal";

import { useWhiteboard } from "@/hooks/classroom/participant/UseWhiteboard";
import { useMedia } from "@/hooks/classroom/participant/UseMedia";
import { useChat } from "@/hooks/classroom/participant/UseChat";

const PARTICIPANTS = [
  { id: 1, name: "استاد کیشانی", mic: true },
  { id: 2, name: "شما", mic: false },
  { id: 3, name: "محیا جعفری", mic: false },
];

export default function ParticipantClassroom() {
  const router = useRouter();
  const [mode, setMode] = useState("whiteboard");
  const [chatOpen, setChatOpen] = useState(true);

  const wb = useWhiteboard(mode);
  const ide = useIDE();
  const media = useMedia();
  const chat = useChat([
    { id: 1, name: "استاد کیشانی", time: "10:32", text: "کسی سوالی داره؟", teacher: true },
  ]);

  return (
    <div className="h-screen bg-[#F0F4F8] flex flex-col overflow-hidden" dir="rtl">
      <Toolbar wb={wb} mode={mode} setMode={setMode} onExit={() => router.push("/participant/dashboard")} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar chatOpen={chatOpen} media={media} participants={PARTICIPANTS} chat={chat} />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 p-3 overflow-hidden">
            <div className="h-full bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col">
              {mode === "whiteboard" && <Whiteboard wb={wb} />}
              {mode === "ide" && <IDEPanel ide={ide} />}
            </div>
          </div>

          <BottomBar media={media} chatOpen={chatOpen} setChatOpen={setChatOpen} />
        </div>
      </div>

      {/* delete file / error modal */}
      <ConfirmModal
        open={!!ide.fileModal}
        title={ide.fileModal?.type === "confirmDelete" ? "آیا مطمئن هستید؟" : "خطا"}
        description={
          ide.fileModal?.type === "confirmDelete"
            ? `حذف فایل «${ide.fileModal?.name}»؟`
            : ide.fileModal?.message
        }
        confirmText={ide.fileModal?.type === "confirmDelete" ? "حذف" : "متوجه شدم"}
        cancelText="انصراف"
        showCancel={ide.fileModal?.type === "confirmDelete"}
        danger={true}
        onConfirm={ide.fileModal?.type === "confirmDelete" ? ide.confirmDeleteFile : () => ide.setFileModal(null)}
        onCancel={() => ide.setFileModal(null)}
      />

      {/* make new file modal */}
      <NewFileModal
        open={ide.newFileOpen}
        name={ide.newFileName}
        setName={ide.setNewFileName}
        onCreate={ide.createNewFile}
        onClose={() => ide.setNewFileOpen(false)}
      />
    </div>
  );
}