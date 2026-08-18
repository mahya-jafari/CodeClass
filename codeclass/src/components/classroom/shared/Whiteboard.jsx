'use client';

import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiTrash2,
  FiDownload,
} from "react-icons/fi";

export default function Whiteboard({ wb, canEdit = true }) {
  return (
    <div className="absolute inset-0 bg-white">

      <canvas
        ref={wb.canvasRef}
        className={`absolute inset-0 w-full h-full ${
          canEdit ? "cursor-crosshair" : "cursor-default"
        }`}
        onMouseDown={wb.start}
        onMouseMove={wb.move}
        onMouseUp={wb.end}
        onMouseLeave={wb.end}
        onClick={wb.addText}
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-white border shadow-lg rounded-xl p-1.5">

        {/* previous page */}
        <button
          onClick={wb.prevPage}
          disabled={wb.page === 0}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30"
          title="صفحه قبل"
        >
          <FiChevronRight />
        </button>

        {/* page number */}
        <span className="px-3 text-sm">
          صفحه {wb.page + 1} از {wb.pages.length}
        </span>

        {/* next page */}
        <button
          onClick={wb.nextPage}
          disabled={wb.page === wb.pages.length - 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30"
          title="صفحه بعد"
        >
          <FiChevronLeft />
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {canEdit && (
          <>
            <button
              onClick={wb.addPage}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
              title="صفحه جدید"
            >
              <FiPlus />
            </button>

            <button
              onClick={wb.deletePage}
              disabled={wb.pages.length === 1}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30"
              title="حذف صفحه"
            >
              <FiTrash2 />
            </button>
          </>
        )}

        {/* download */}
        <button
          onClick={wb.downloadPDF}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          title="دانلود PDF"
        >
          <FiDownload />
        </button>

      </div>
    </div>
  );
}