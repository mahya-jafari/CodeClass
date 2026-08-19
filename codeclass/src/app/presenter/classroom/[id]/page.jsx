'use client';

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import PDFAnnotation from "@/components/classroom/shared/PDFAnnotation";

import { usePDFAnnotation } from "@/hooks/classroom/UsePDFAnnotation";
import { useWhiteboard } from "@/hooks/classroom/UseWhiteboard";
import { useMedia } from "@/hooks/classroom/UseMedia";
import { useChat } from "@/hooks/classroom/UseChat";
import { useTextBoxes } from "@/hooks/classroom/UseTextBoxes";

import {
  useGetClassroomParticipantsQuery,
  useGetClassroomMessagesQuery,
} from "@/store/api/presenterApis";

export default function PresenterClassroom() {
  const router = useRouter();
  const { id = "1" } = useParams();

  const [mode, setMode] = useState("whiteboard");
  const [chatOpen, setChatOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfViewMode, setPdfViewMode] = useState(false);
  const [participants, setParticipants] = useState([]);

  const [toolColor, setToolColor] = useState("#000000");
  const [toolSize, setToolSize] = useState(3);

  const { data: apiParticipants = [] } =
    useGetClassroomParticipantsQuery(id);

  const { data: apiMessages = [] } =
    useGetClassroomMessagesQuery(id);

  const wb = useWhiteboard(mode);
  const pdf = usePDFAnnotation(mode === "pdf");
  const media = useMedia();
  const chat = useChat(apiMessages);
  const ide = useIDE();
  const tb = useTextBoxes();

  useEffect(() => {
    if (apiParticipants.length) {
      setParticipants(apiParticipants);
    }
  }, [apiParticipants]);

  useEffect(() => {
    if (mode !== "pdf") {
      setPdfViewMode(false);
    }
  }, [mode]);

  const active = mode === "pdf" ? pdf : wb;

  const toggleParticipantEdit = (id, value) => {
    setParticipants((ps) =>
      ps.map((p) =>
        p.id === id && !p.isSelf
          ? { ...p, canEdit: value }
          : p
      )
    );
  };

  const kickParticipant = (id) => {
    setParticipants((ps) =>
      ps.filter((p) => p.id !== id)
    );
  };

  const removePdf = () => {
    pdf.reset();
    setPdfUrl(null);
    setPdfViewMode(false);
  };

  const sidebarProps = {
    chatOpen,
    videoSrc: media.videoSrc,
    setVideoSrc: media.setVideoSrc,
    videoRef: media.videoRef,
    playing: media.playing,
    setPlaying: media.setPlaying,
    cameraOn: media.cameraOn,
    setCameraOn: media.setCameraOn,
    camRef: media.camRef,
    participants,
    setParticipants,
    toggleParticipantEdit,
    kickParticipant,
    messages: chat.messages,
    message: chat.message,
    setMessage: chat.setMessage,
    send: chat.send,
  };

  const textBoxProps = {
    boxes: tb.boxes,
    selectedId: tb.selectedId,
    setSelectedId: tb.setSelectedId,
    updateBox: tb.updateBox,
    removeBox: tb.removeBox,
    addBox: tb.addBox,
    color: toolColor,
    size: toolSize,
    enabled: true,
  };

  return (
    <div
      className="h-[100dvh] bg-[#F0F4F8] flex flex-col overflow-hidden"
      dir="rtl"
    >
      <Toolbar
        undo={active.undo}
        redo={active.redo}
        tool={active.tool}
        setTool={active.setTool}
        color={toolColor}
        setColor={setToolColor}
        size={toolSize}
        setSize={setToolSize}
        canvasRef={active.canvasRef}
        recording={media.recording}
        toggleRec={media.toggleRec}
        mode={mode}
        setMode={setMode}
        onOpenSettings={() => setSettingsOpen(true)}
        onExit={() => router.push("/presenter/dashboard")}
        pdfViewMode={pdfViewMode}
        setPdfViewMode={setPdfViewMode}
        onRemovePdf={removePdf}
      />

      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* Desktop Sidebar */}
        <div className="hidden md:flex h-full">
          <Sidebar {...sidebarProps} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-w-0 min-h-0">

          <div className="flex-1 p-2 md:p-3 overflow-hidden min-h-0">
            <div className="h-full bg-white rounded-xl md:rounded-2xl border shadow-sm overflow-hidden flex flex-col relative">

              {/* Mobile Media */}
              {mode === "media" && (
                <div className="md:hidden flex-1 min-h-0">
                  <Sidebar
                    {...sidebarProps}
                    chatOpen
                    fullHeight
                    compact
                  />
                </div>
              )}

              {/* Whiteboard */}
              {mode === "whiteboard" && (
                <>
                  <Whiteboard wb={wb} />

                  <TextBoxLayer
                    {...textBoxProps}
                    tool={wb.tool}
                  />
                </>
              )}

              {/* PDF */}
              {mode === "pdf" && (
                <div className="relative flex-1 min-h-0 overflow-hidden">

                  {pdfUrl ? (
                    <>
                      <iframe
                        src={pdfUrl}
                        title="pdf"
                        className="absolute inset-0 w-full h-full border-0"
                      />

                      <PDFAnnotation
                        annotation={pdf}
                        viewMode={pdfViewMode}
                      />

                      {!pdfViewMode && (
                        <TextBoxLayer
                          {...textBoxProps}
                          tool={pdf.tool}
                        />
                      )}
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-400 cursor-pointer">
                      <FiUpload size={36} />

                      <p className="text-sm">
                        برای آپلود PDF کلیک کنید
                      </p>

                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (file) {
                            setPdfUrl(
                              URL.createObjectURL(file)
                            );
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              )}

              {/* IDE */}
              {mode === "ide" && (
                <IDEPanel ide={ide} />
              )}

            </div>
          </div>

          <BottomBar
            micOn={media.micOn}
            toggleMic={media.toggleMic}
            cameraOn={media.cameraOn}
            toggleCam={media.toggleCam}
            handRaised={media.handRaised}
            toggleHand={media.toggleHand}
            chatOpen={chatOpen}
            setChatOpen={setChatOpen}
            mode={mode}
            setMode={setMode}
          />
        </div>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      <ConfirmModal
        open={!!ide.fileModal}
        title={
          ide.fileModal?.type === "confirmDelete"
            ? "آیا مطمئن هستید؟"
            : "خطا"
        }
        description={
          ide.fileModal?.type === "confirmDelete"
            ? `حذف فایل «${ide.fileModal?.name}»؟`
            : ide.fileModal?.message
        }
        confirmText={
          ide.fileModal?.type === "confirmDelete"
            ? "حذف"
            : "متوجه شدم"
        }
        cancelText="انصراف"
        showCancel={
          ide.fileModal?.type === "confirmDelete"
        }
        danger
        onConfirm={
          ide.fileModal?.type === "confirmDelete"
            ? ide.confirmDeleteFile
            : () => ide.setFileModal(null)
        }
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