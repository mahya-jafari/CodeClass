'use client';

import Editor from "@monaco-editor/react";
import { FiPlus, FiUpload, FiFile, FiTrash2 } from "react-icons/fi";

export default function IDEPanel({
  files,
  file,
  setFile,
  setFiles,
  addFile,
  requestDeleteFile,
  uploadFiles,
  getLang,
}) {
  return (
    <div className="flex-1 flex overflow-hidden" dir="ltr">
      <div className="w-48 bg-[#1e1e1e] text-gray-300 flex flex-col border-r border-gray-700">
        <div className="px-2 py-1.5 text-[10px] text-gray-500 border-b border-gray-700 flex items-center justify-between">
          <span>EXPLORER</span>
          <div className="flex items-center gap-0.5">
            <button onClick={addFile} title="فایل جدید" className="p-1 hover:bg-[#37373d] rounded text-gray-400 hover:text-white">
              <FiPlus size={12} />
            </button>
            <label title="آپلود فایل / پروژه" className="p-1 hover:bg-[#37373d] rounded text-gray-400 hover:text-white cursor-pointer">
              <FiUpload size={12} />
              <input type="file" multiple accept=".js,.jsx,.ts,.tsx,.css,.scss,.html,.json,.md,.py,.txt,.java,.c,.cpp" className="hidden" onChange={uploadFiles} />
            </label>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {Object.keys(files).map((f) => (
            <div key={f} className={`group flex items-center gap-1 px-2 py-1 text-[11px] ${file === f ? "bg-[#37373d] text-white" : "hover:bg-[#2a2a2a]"}`}>
              <button onClick={() => setFile(f)} className="flex-1 flex items-center gap-1 text-left truncate">
                <FiFile size={11} className="text-blue-400 flex-shrink-0" /> {f}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); requestDeleteFile(f); }}
                title="حذف"
                className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-500 hover:text-red-400 rounded"
              >
                <FiTrash2 size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1">
        <Editor
          height="100%"
          theme="vs-dark"
          language={getLang(file)}
          value={files[file] || ""}
          onChange={(v) => setFiles((p) => ({ ...p, [file]: v || "" }))}
          options={{ fontSize: 13, minimap: { enabled: false }, automaticLayout: true }}
        />
      </div>
    </div>
  );
}