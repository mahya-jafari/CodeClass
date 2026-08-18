'use client';

import { useState, useEffect } from "react";
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
  const params = useParams();
  const classId = params?.id || "1";

  const [mode, setMode] = useState("whiteboard");
  const [chatOpen, setChatOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const { data: apiParticipants = [] } = useGetClassroomParticipantsQuery(classId);
  const { data: apiMessages = [] } = useGetClassroomMessagesQuery(classId);
  const [participants, setParticipants] = useState([]);
  const [pdfViewMode, setPdfViewMode] = useState(false);

  useEffect(() => {
    if (apiParticipants.length > 0) {
      setParticipants(apiParticipants);
    }
  }, [apiParticipants]);

  useEffect(() => {
    if (mode !== "pdf") setPdfViewMode(false);
  }, [mode]);

  const wb = useWhiteboard(mode);
  const pdf = usePDFAnnotation(mode === "pdf");
  const media = useMedia();
  const chat = useChat(apiMessages); 
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

  // clears the loaded PDF (and its view-mode state) so the empty-state
  // upload prompt shows again and the user can pick a different file;
  // also wipes annotations so old strokes don't show up on the next PDF
  const handleRemovePdf = () => {
    pdf.reset();
    setPdfUrl(null);
    setPdfViewMode(false);
  };

  return (
    <div className="h-[100dvh] bg-[#F0F4F8] flex flex-col overflow-hidden" dir="rtl">
      <Toolbar
        undo={mode === "pdf" ? pdf.undo : wb.undo}
        redo={mode === "pdf" ? pdf.redo : wb.redo}
        tool={mode === "pdf" ? pdf.tool : wb.tool}
        setTool={mode === "pdf" ? pdf.setTool : wb.setTool}
        color={mode === "pdf" ? pdf.color : wb.color}
        setColor={mode === "pdf" ? pdf.setColor : wb.setColor}
        size={mode === "pdf" ? pdf.size : wb.size}
        setSize={mode === "pdf" ? pdf.setSize : wb.setSize}
        canvasRef={mode === "pdf" ? pdf.canvasRef : wb.canvasRef}
        recording={media.recording}
        toggleRec={media.toggleRec}
        mode={mode}
        setMode={setMode}
        onOpenSettings={() => setSettingsOpen(true)}
        onExit={() => router.push("/presenter/dashboard")}
        pdfViewMode={pdfViewMode}
        setPdfViewMode={setPdfViewMode}
        onRemovePdf={handleRemovePdf}
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
                <div className="relative flex-1 min-h-0 overflow-hidden">
                  {pdfUrl ? (
                    <>
                      <iframe
                        src={pdfUrl}
                        className="absolute inset-0 w-full h-full border-0"
                        title="pdf"
                      />

                      <PDFAnnotation
                        annotation={pdf}
                        viewMode={pdfViewMode}
                      />
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 gap-3 cursor-pointer">
                      <FiUpload size={36} />
                      <p className="text-sm">برای آپلود PDF کلیک کنید</p>

                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setPdfUrl(URL.createObjectURL(file));
                        }}
                      />
                    </label>
                  )}
                </div>
              )}

              {mode === "ide" && <IDEPanel ide={ide} />}

              {mode === "whiteboard" && (
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