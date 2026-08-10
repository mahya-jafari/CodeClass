'use client';

import { useEffect, useState } from "react";

export default function MSWProvider({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      if (process.env.NEXT_PUBLIC_API_MOCKING === "true") {
        const { worker } = await import("@/mocks/browser");
        await worker.start({
          onUnhandledRequest: "bypass",
        });
      }
      setReady(true);
    }
    init();
  }, []);

  if (!ready) return null; 
  return children;
}