'use client';

import { useState, useRef } from "react";

export function useMedia() {
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [mediaError, setMediaError] = useState(null); 
  const camRef = useRef(null);
  const streamRef = useRef(null);

  const clearMediaError = () => setMediaError(null);

  const toggleMic = async () => {
    try {
      if (micOn) {
        streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = false));
        setMicOn(false);
      } else {
        if (!streamRef.current) {
          streamRef.current = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: cameraOn,
          });
        }
        streamRef.current.getAudioTracks().forEach((t) => (t.enabled = true));
        setMicOn(true);
      }
    } catch {
      setMediaError({
        title: "دسترسی میکروفون",
        message: "دسترسی به میکروفون داده نشد. لطفاً مجوز مرورگر را بررسی کنید.",
      });
    }
  };

  const toggleCam = async () => {
    try {
      if (cameraOn) {
        streamRef.current?.getVideoTracks().forEach((t) => {
          t.stop();
          streamRef.current?.removeTrack(t);
        });
        if (camRef.current) camRef.current.srcObject = null;
        setCameraOn(false);
      } else {
        const s = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: micOn,
        });
        streamRef.current = streamRef.current || s;
        s.getVideoTracks().forEach((t) => streamRef.current.addTrack(t));
        if (camRef.current) camRef.current.srcObject = streamRef.current;
        setCameraOn(true);
      }
    } catch {
      setMediaError({
        title: "دسترسی دوربین",
        message: "دسترسی به دوربین داده نشد. لطفاً مجوز مرورگر را بررسی کنید.",
      });
    }
  };

  return {
    micOn,
    cameraOn,
    camRef,
    toggleMic,
    toggleCam,
    mediaError,
    clearMediaError,
  };
}