'use client';

import { useState, useRef } from "react";

/**
 * shared useMedia for presenter and participant
 */

export function useMedia() {
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaError, setMediaError] = useState(null);

  const camRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

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
        setVideoSrc(null);
      }
    } catch {
      setMediaError({
        title: "دسترسی دوربین",
        message: "دسترسی به دوربین داده نشد. لطفاً مجوز مرورگر را بررسی کنید.",
      });
    }
  };

  const toggleRec = async () => {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      const r = new MediaRecorder(s);
      chunksRef.current = [];
      r.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data);
      r.onstop = () => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob(chunksRef.current, { type: "video/webm" }));
        a.download = `session-${Date.now()}.webm`;
        a.click();
        s.getTracks().forEach((t) => t.stop());
      };
      recorderRef.current = r;
      r.start();
      setRecording(true);
    } catch {
      setMediaError({
        title: "ضبط صفحه",
        message: "ضبط لغو شد یا دسترسی داده نشد.",
      });
    }
  };

  return {
    micOn,
    cameraOn,
    setCameraOn,
    camRef,
    toggleMic,
    toggleCam,
    mediaError,
    clearMediaError,
    videoRef,
    videoSrc,
    setVideoSrc,
    playing,
    setPlaying,
    recording,
    toggleRec,
  };
}