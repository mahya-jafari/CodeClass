'use client';

import { useState, useRef } from "react";

export function useMedia() {
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [videoSrc, setVideoSrc] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [recording, setRecording] = useState(false);

  const camRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const toggleMic = async () => {
    try {
      if (micOn) {
        streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = false));
        setMicOn(false);
      } else {
        if (!streamRef.current) streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: cameraOn });
        streamRef.current.getAudioTracks().forEach((t) => (t.enabled = true));
        setMicOn(true);
      }
    } catch {
      alert("دسترسی میکروفون داده نشد");
    }
  };

  const toggleCam = async () => {
    try {
      if (cameraOn) {
        streamRef.current?.getVideoTracks().forEach((t) => { t.stop(); streamRef.current.removeTrack(t); });
        if (camRef.current) camRef.current.srcObject = null;
        setCameraOn(false);
      } else {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: micOn });
        streamRef.current = streamRef.current || s;
        s.getVideoTracks().forEach((t) => streamRef.current.addTrack(t));
        if (camRef.current) camRef.current.srcObject = streamRef.current;
        setCameraOn(true);
        setVideoSrc(null);
      }
    } catch {
      alert("دسترسی دوربین داده نشد");
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
      alert("ضبط لغو شد");
    }
  };

  return {
    micOn, cameraOn, setCameraOn, camRef,
    videoRef, videoSrc, setVideoSrc, playing, setPlaying,
    recording, toggleMic, toggleCam, toggleRec,
  };
}