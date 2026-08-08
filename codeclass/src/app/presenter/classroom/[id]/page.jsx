'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUpload } from "react-icons/fi";

import ConfirmModal from "@/components/ui/ConfirmModal";
import Toolbar from "@/components/classroom/presenter/Toolbar";
import Sidebar from "@/components/classroom/presenter/Sidebar";
import Whiteboard from "@/components/classroom/shared/Whiteboard";
import IDEPanel, { useIDE } from "@/components/classroom/shared/IDEPanel";
import BottomBar from "@/components/classroom/shared/BottomBar";
import SettingsModal from "@/components/classroom/presenter/SettingsModal";
import NewFileModal from "@/components/classroom/shared/NewFileModal";
import TextBoxLayer from "@/components/classroom/shared/TextBoxLayer";

import { useWhiteboard } from "@/hooks/classroom/UseWhiteboard";
import { useMedia } from "@/hooks/classroom/UseMedia";
import { useChat } from "@/hooks/classroom/UseChat";
import { useTextBoxes } from "@/hooks/classroom/UseTextBoxes";

export default function PresenterClassroom() {
  const router = useRouter();
  const [mode, setMode] = useState("whiteboard");
  const [chatOpen, setChatOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [participants, setParticipants] = useState([
    { id: 1, name: "استاد کیشانی", mic: true, canEdit: true, isSelf: true },
    { id: 2, name: "محیا جعفری", mic: false, canEdit: false },
    { id: 3, name: "فاطمه قاسمی", mic: false, canEdit: false },
    { id: 4, name: "مریم حسینی", mic: false, canEdit: false },
  ]);

  const wb = useWhiteboard(mode);
  const media = useMedia();
  const chat = useChat([
    { id: 1, name: "محیا جعفری", time: "10:30", text: "من متوجه نشدم", teacher: false },
    { id: 2, name: "استاد کیشانی", time: "10:32", text: "دوباره توضیح میدم", teacher: true },
  ]);
  const ide = useIDE();
  const tb = useTextBoxes();

  const toggleParticipantEdit = (id, value) => {
    setParticipants((ps) =>
      ps.map((p) => {
        if (p.id !== id || p.isSelf) return p;
        return { ...p, canEdit: value };
      })
    );
  };

  const kickParticipant = (id) => {
    setParticipants((ps) => ps.filter((p) => p.id !== id));
  };

  return (
    <div className="h-[100dvh] bg-[#F0F4F8] flex flex-col overflow-hidden" dir="rtl">
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

      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="hidden md:flex h-full">
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
            toggleParticipantEdit={toggleParticipantEdit}
            kickParticipant={kickParticipant}
            messages={chat.messages}
            message={chat.message}
            setMessage={chat.setMessage}
            send={chat.send}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-w-0 min-h-0">
          <div className="flex-1 p-2 md:p-3 overflow-hidden min-h-0">
            <div className="h-full bg-white rounded-xl md:rounded-2xl border shadow-sm overflow-hidden flex flex-col relative">

              {/* موبایل: ویدیو + اعضا + چت */}
              {mode === "media" && (
                <div className="md:hidden flex-1 flex flex-col min-h-0">
                  <Sidebar
                    chatOpen={true}
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
                    toggleParticipantEdit={toggleParticipantEdit}
                    kickParticipant={kickParticipant}
                    messages={chat.messages}
                    message={chat.message}
                    setMessage={chat.setMessage}
                    send={chat.send}
                    fullHeight
                    compact
                  />
                </div>
              )}

              {mode === "whiteboard" && <Whiteboard wb={wb} />}

              {mode === "pdf" && (
                pdfUrl ? (
                  <iframe src={pdfUrl} className="flex-1 w-full border-0" title="pdf" />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
                    <FiUpload size={36} />
                    <p className="text-sm">PDF آپلود کنید</p>
                  </div>
                )
              )}

              {mode === "ide" && <IDEPanel ide={ide} />}

              {/* لایه باکس متن — روی وایت‌برد و PDF */}
              {(mode === "whiteboard" || mode === "pdf") && (
                <TextBoxLayer
                  boxes={tb.boxes}
                  selectedId={tb.selectedId}
                  setSelectedId={tb.setSelectedId}
                  updateBox={tb.updateBox}
                  removeBox={tb.removeBox}
                  addBox={tb.addBox}
                  tool={wb.tool}
                  color={wb.color}
                  size={wb.size}
                  enabled
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
            mode={mode}
            setMode={setMode}
          />
        </div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

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
