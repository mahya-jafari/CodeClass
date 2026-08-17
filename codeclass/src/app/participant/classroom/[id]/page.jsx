'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ConfirmModal from "@/components/ui/ConfirmModal";

import Toolbar from "@/components/classroom/participant/Toolbar";
import Sidebar from "@/components/classroom/participant/Sidebar";
import Whiteboard from "@/components/classroom/shared/Whiteboard";
import IDEPanel, { useIDE } from "@/components/classroom/shared/IDEPanel";
import BottomBar from "@/components/classroom/shared/BottomBar";
import NewFileModal from "@/components/classroom/shared/NewFileModal";
import TextBoxLayer from "@/components/classroom/shared/TextBoxLayer";
import PDFAnnotation from "@/components/classroom/shared/PDFAnnotation";
import { usePDFAnnotation } from "@/hooks/classroom/UsePDFAnnotation";
import { useWhiteboard } from "@/hooks/classroom/UseWhiteboard";
import { useMedia } from "@/hooks/classroom/UseMedia";
import { useChat } from "@/hooks/classroom/UseChat";
import { useTextBoxes } from "@/hooks/classroom/UseTextBoxes";
import {
  useGetParticipantClassroomParticipantsQuery,
  useGetParticipantClassroomMessagesQuery,
} from "../../../../store/api/participantApis";

export default function ParticipantClassroom() {
  const router = useRouter();
  const params = useParams();
  const classId = params?.id || "1";
  const [mode, setMode] = useState("whiteboard");
  const [chatOpen, setChatOpen] = useState(true);
  const [canEdit, setCanEdit] = useState(false);
  const { data: apiParticipants = [] } = useGetParticipantClassroomParticipantsQuery(classId);
  const { data: apiMessages = [] } = useGetParticipantClassroomMessagesQuery(classId);
  const [participants, setParticipants] = useState([]);
  const pdf = usePDFAnnotation(mode === "pdf", canEdit);
  const [pdfViewMode, setPdfViewMode] = useState(false);
  useEffect(() => {
    if (apiParticipants.length > 0) {
      setParticipants(apiParticipants);
    }
  }, [apiParticipants]);

  useEffect(() => {
    if (mode !== "pdf") setPdfViewMode(false);
  }, [mode]);

  const wb = useWhiteboard(mode === "media" ? "whiteboard" : mode, canEdit);
  const ide = useIDE(canEdit);
  const media = useMedia();
  const chat = useChat(apiMessages);
  const tb = useTextBoxes();

  return (
    <div className="h-[100dvh] bg-[#F0F4F8] flex flex-col overflow-hidden" dir="rtl">
      <Toolbar
        wb={wb}
        pdf={pdf}
        mode={mode}
        setMode={setMode}
        canEdit={canEdit}
        pdfViewMode={pdfViewMode}
        setPdfViewMode={setPdfViewMode}
        onExit={() => router.push("/participant/dashboard")}
      />

      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="hidden md:flex h-full">
          <Sidebar
            chatOpen={chatOpen}
            media={media}
            participants={participants}
            chat={chat}
            compact={false}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-w-0 min-h-0">
          <div className="flex-1 p-2 md:p-3 overflow-hidden min-h-0">
            <div className="h-full bg-white rounded-xl md:rounded-2xl border shadow-sm overflow-hidden flex flex-col relative">
              {mode === "media" && (
                <div className="md:hidden flex-1 flex flex-col min-h-0">
                  <Sidebar
                    chatOpen={true}
                    media={media}
                    participants={participants}
                    chat={chat}
                    compact={true}
                    fullHeight
                  />
                </div>
              )}

              {mode === "whiteboard" && <Whiteboard wb={wb} canEdit={canEdit} />}
              {mode === "ide" && <IDEPanel ide={ide} canEdit={canEdit} />}

              {mode === "whiteboard" && canEdit && (
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
            media={media}
            chatOpen={chatOpen}
            setChatOpen={setChatOpen}
            mode={mode}
            setMode={setMode}
          />
        </div>
      </div>

      {canEdit && (
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
      )}

      <ConfirmModal
        open={!!media.mediaError}
        title={media.mediaError?.title || "خطا"}
        description={media.mediaError?.message}
        confirmText="متوجه شدم"
        showCancel={false}
        danger={true}
        onConfirm={media.clearMediaError}
        onCancel={media.clearMediaError}
      />

      {canEdit && (
        <NewFileModal
          open={ide.newFileOpen}
          name={ide.newFileName}
          setName={ide.setNewFileName}
          onCreate={ide.createNewFile}
          onClose={() => ide.setNewFileOpen(false)}
        />
      )}
    </div>
  );
}