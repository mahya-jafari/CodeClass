'use client';

import { useState } from "react";

export function useChat(initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");

  const send = () => {
    if (!message.trim()) return;
    const t = new Date();
    setMessages((m) => [...m, {
      id: Date.now(), name: "شما",
      time: `${t.getHours()}:${String(t.getMinutes()).padStart(2, "0")}`,
      text: message, teacher: true
    }]);
    setMessage("");
  };

  return { messages, message, setMessage, send };
}