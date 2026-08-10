'use client';

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";
import { loadFromStorage } from "@/features/auth/authSlice";

export default function StoreProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    storeRef.current.dispatch(loadFromStorage());
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}