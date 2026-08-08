'use client';

import { useState, useCallback } from "react";

let _id = 1;
const nextId = () => `tb-${_id++}`;

/**
 * Hook for managing text boxes on the whiteboard/PDF
 */
export function useTextBoxes() {
  const [boxes, setBoxes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const addBox = useCallback((x, y, color = "#2563eb", fontSize = 18) => {
    const id = nextId();
    const box = {
      id,
      x,
      y,
      width: 180,
      height: 48,
      text: "",
      color,
      fontSize,
    };
    setBoxes((prev) => [...prev, box]);
    setSelectedId(id);
    return id;
  }, []);

  const updateBox = useCallback((id, patch) => {
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }, []);

  const removeBox = useCallback((id) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
    setSelectedId((cur) => (cur === id ? null : cur));
  }, []);

  const clearAll = useCallback(() => {
    setBoxes([]);
    setSelectedId(null);
  }, []);

  return {
    boxes,
    selectedId,
    setSelectedId,
    addBox,
    updateBox,
    removeBox,
    clearAll,
  };
}
