'use client';

import { useState } from "react";

const DEFAULT_FILES = {
  "App.jsx": `import React, { useState } from 'react';\n\nexport default function App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>Hello React 👋</h1>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(c => c + 1)}>Increment</button>\n    </div>\n  );\n}`,
};

export function useIDE() {
  const [file, setFile] = useState("App.jsx");
  const [files, setFiles] = useState(DEFAULT_FILES);

  const [fileModal, setFileModal] = useState(null);
  const [newFileOpen, setNewFileOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");

  const getLang = (name) => {
    const ext = name.split(".").pop()?.toLowerCase();
    const map = {
      js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript",
      css: "css", scss: "scss", html: "html", json: "json", md: "markdown",
      py: "python", java: "java", c: "c", cpp: "cpp", go: "go", rs: "rust",
    };
    return map[ext] || "javascript";
  };

  const addFile = () => {
    setNewFileName("");
    setNewFileOpen(true);
  };

  const createNewFile = () => {
    const n = newFileName.trim();
    if (!n) return;
    if (files[n]) {
      setNewFileOpen(false);
      setFileModal({ type: "error", message: "فایلی با این نام وجود دارد" });
      return;
    }
    setFiles((p) => ({ ...p, [n]: "" }));
    setFile(n);
    setNewFileOpen(false);
    setNewFileName("");
  };

  const requestDeleteFile = (name) => {
    if (Object.keys(files).length <= 1) {
      setFileModal({ type: "error", message: "حداقل یک فایل باید باقی بماند" });
      return;
    }
    setFileModal({ type: "confirmDelete", name });
  };

  const confirmDeleteFile = () => {
    const name = fileModal?.name;
    setFiles((p) => {
      const next = { ...p };
      delete next[name];
      const remaining = Object.keys(next);
      if (file === name) setFile(remaining[0] || "");
      return next;
    });
    setFileModal(null);
  };

  const uploadFiles = (e) => {
    const list = e.target.files;
    if (!list?.length) return;
    Array.from(list).forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => {
        setFiles((p) => ({ ...p, [f.name]: reader.result || "" }));
        setFile(f.name);
      };
      reader.readAsText(f);
    });
    e.target.value = "";
  };

  return {
    file, setFile, files, setFiles,
    fileModal, setFileModal,
    newFileOpen, setNewFileOpen, newFileName, setNewFileName,
    getLang, addFile, createNewFile, requestDeleteFile, confirmDeleteFile, uploadFiles,
  };
}