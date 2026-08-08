'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUpload } from "react-icons/fi";

import ConfirmModal from "@/components/ui/ConfirmModal";
import Toolbar from "@/components/classroom/presenter/Toolbar";
import Sidebar from "@/components/classroom/presenter/Sidebar";
import Whiteboard from "@/components/classroom/presenter/Whiteboard";
import IDEPanel, { useIDE } from "@/components/classroom/presenter/IDEPanel";
import BottomBar from "@/components/classroom/presenter/BottomBar";
import SettingsModal from "@/components/classroom/presenter/SettingsModal";
import NewFileModal from "@/components/classroom/presenter/NewFileModal";

import { useWhiteboard } from "@/hooks/classroom/presenter/UseWhiteboard";
import { useMedia } from "@/hooks/classroom/presenter/UseMedia";
import { useChat } from "@/hooks/classroom/presenter/UseChat";

export default function PresenterClassroom() {
  const router = useRouter();
  const [mode, setMode] = useState("whiteboard");
  const [chatOpen, setChatOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [participants, setParticipants] = useState([
    { id: 1, name: "استاد کیشانی", mic: true },
    { id: 2, name: "محیا جعفری", mic: false },
    { id: 3, name: "فاطمه قاسمی", mic: false },
    { id: 4, name: "مریم حسینی", mic: false },
  ]);

  const wb = useWhiteboard(mode);
  const media = useMedia();
  const chat = useChat([
    { id: 1, name: "محیا جعفری", time: "10:30", text: "من متوجه نشدم", teacher: false },
    { id: 2, name: "استاد کیشانی", time: "10:32", text: "دوباره توضیح میدم", teacher: true },
  ]);
  const ide = useIDE();

  return (
    <div className="h-screen bg-[#F0F4F8] flex flex-col overflow-hidden" dir="rtl">
      <Toolbar
        undo={wb.undo}
        redo={wb.redo}
        tool={wb.tool}
        setTool={wb.setTool}
        color={wb.color}
        setColor={wb.setColor}
        size={wb.size}
        setSize={wb.setSize}
        canvasRef={wb.canvasRef}
        recording={media.recording}
        toggleRec={media.toggleRec}
        mode={mode}
        setMode={setMode}
        setPdfUrl={setPdfUrl}
        onOpenSettings={() => setSettingsOpen(true)}
        onExit={() => router.push("/presenter/dashboard")}
      />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          chatOpen={chatOpen}
          videoSrc={media.videoSrc}
          setVideoSrc={media.setVideoSrc}
          videoRef={media.videoRef}
          playing={media.playing}
          setPlaying={media.setPlaying}
          cameraOn={media.cameraOn}
          setCameraOn={media.setCameraOn}
          camRef={media.camRef}
          participants={participants}
          setParticipants={setParticipants}
          messages={chat.messages}
          message={chat.message}
          setMessage={chat.setMessage}
          send={chat.send}
        />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 p-3 overflow-hidden">
            <div className="h-full bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col">
              {mode === "whiteboard" && (
                <Whiteboard canvasRef={wb.canvasRef} start={wb.start} move={wb.move} end={wb.end} addText={wb.addText} />
              )}
              {mode === "pdf" && (
                pdfUrl ? <iframe src={pdfUrl} className="flex-1 w-full border-0" /> : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
                    <FiUpload size={36} />
                    <p className="text-sm">PDF آپلود کنید</p>
                  </div>
                )
              )}
              {mode === "ide" && (
                <IDEPanel
                  files={ide.files}
                  file={ide.file}
                  setFile={ide.setFile}
                  setFiles={ide.setFiles}
                  addFile={ide.addFile}
                  requestDeleteFile={ide.requestDeleteFile}
                  uploadFiles={ide.uploadFiles}
                  getLang={ide.getLang}
                />
              )}
            </div>
          </div>

          <BottomBar
            micOn={media.micOn}
            toggleMic={media.toggleMic}
            cameraOn={media.cameraOn}
            toggleCam={media.toggleCam}
            chatOpen={chatOpen}
            setChatOpen={setChatOpen}
          />
        </div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Delete Confirmation / Error Modal */}
      <ConfirmModal
        open={!!ide.fileModal}
        title={ide.fileModal?.type === "confirmDelete" ? "آیا مطمئن هستید؟" : "خطا"}
        description={
          ide.fileModal?.type === "confirmDelete"
            ? `حذف فایل «${ide.fileModal?.name}»؟`
            : ide.fileModal?.message
        }
        confirmText={ide.fileModal?.type === "confirmDelete" ? "حذف" : "متوجه شدم"}
        cancelText={ide.fileModal?.type === "confirmDelete" ? "انصراف" : "متوجه شدم"}
        danger={ide.fileModal?.type === "confirmDelete"}
        onConfirm={ide.fileModal?.type === "confirmDelete" ? ide.confirmDeleteFile : () => ide.setFileModal(null)}
        onCancel={() => ide.setFileModal(null)}
      />

      {/* New File Creation Modal */}
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