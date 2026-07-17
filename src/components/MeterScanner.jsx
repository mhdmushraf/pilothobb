import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, Camera, Image as ImageIcon, Zap, ZapOff, Loader2 } from "lucide-react";

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function MeterScanner({ onClose, onManualEnter, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);
  const [reading, setReading] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(true);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        const track = stream.getVideoTracks()[0];
        const caps = track?.getCapabilities?.();
        if (caps && "torch" in caps) setTorchSupported(true);
        setCameraReady(true);
      } catch {
        setCameraError(true);
      }
    };

    startCamera();
    return () => {
      mounted = false;
      stopCamera();
    };
  }, [stopCamera]);

  const captureFromVideo = async () => {
    setReading(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) throw new Error("No video");

      const w = video.videoWidth || 720;
      const h = video.videoHeight || 960;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, w, h);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", 0.9)
      );
      if (!blob) throw new Error("Capture failed");

      const file = new File([blob], "meter-scan.jpg", { type: "image/jpeg" });
      stopCamera();
      await onCapture(file);
    } catch {
      stopCamera();
      onClose();
    }
  };

  const handleGalleryPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReading(true);
    stopCamera();
    try {
      await onCapture(file);
    } catch {
      onClose();
    }
  };

  const toggleTorch = async () => {
    const track = streamRef.current?.getVideoTracks?.()[0];
    if (!track) return;
    try {
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn((v) => !v);
    } catch {
      /* ignore */
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const handleManualEnter = () => {
    stopCamera();
    onManualEnter();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col safe-top safe-bottom">
      {/* Top bar */}
      <div className="flex items-center gap-3 p-4 shrink-0">
        <button onClick={handleClose} className="p-2 -ml-1 text-cockpit-cream active:scale-90 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center">
          <p className="font-heading font-bold text-cockpit-cream text-base">Scan your Hobbs / Tach</p>
          <p className="text-xs text-cockpit-muted">Position the meter inside the frame</p>
        </div>
        <div className="w-9" />
      </div>

      {/* Camera preview */}
      <div className="relative flex-1 overflow-hidden">
        {cameraReady ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-8">
              <Camera className="w-12 h-12 text-cockpit-muted mx-auto mb-3" />
              <p className="text-sm text-cockpit-muted">Camera unavailable</p>
              <p className="text-xs text-cockpit-muted mt-1">Use the gallery button to pick a photo</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-cockpit-amber animate-spin" />
          </div>
        )}

        {/* Frame overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative" style={{ width: "80%", maxWidth: 320, aspectRatio: "3 / 2" }}>
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-cockpit-amber rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-cockpit-amber rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-cockpit-amber rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-cockpit-amber rounded-br-lg" />

            {/* Scan line animation */}
            {!prefersReducedMotion && !reading && (
              <div
                className="absolute left-2 right-2 h-0.5 bg-cockpit-amber shadow-[0_0_8px_rgba(255,157,46,0.8)]"
                style={{ animation: "scanSweep 2.2s ease-in-out infinite" }}
              />
            )}
          </div>
        </div>

        {/* Reading overlay */}
        {reading && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-cockpit-amber animate-spin" />
            <p className="text-sm text-cockpit-cream font-heading">Reading…</p>
            <p className="text-xs text-cockpit-muted">AI is checking the meter</p>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="shrink-0 px-6 pb-6 pt-4 flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-8">
          {/* Gallery */}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={reading}
            className="w-12 h-12 rounded-full bg-cockpit-panel border border-cockpit-border flex items-center justify-center text-cockpit-cream active:scale-90 transition-transform disabled:opacity-40"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Capture */}
          <button
            onClick={cameraReady ? captureFromVideo : () => fileRef.current?.click()}
            disabled={reading}
            className="w-16 h-16 rounded-full border-4 border-cockpit-cream bg-cockpit-amber flex items-center justify-center active:scale-90 transition-transform shadow-lg shadow-cockpit-amber/40 disabled:opacity-40"
          >
            {reading ? <Loader2 className="w-6 h-6 text-cockpit-bg animate-spin" /> : <Camera className="w-7 h-7 text-cockpit-bg" />}
          </button>

          {/* Torch */}
          <button
            onClick={toggleTorch}
            disabled={!torchSupported || reading}
            className="w-12 h-12 rounded-full bg-cockpit-panel border border-cockpit-border flex items-center justify-center text-cockpit-cream active:scale-90 transition-transform disabled:opacity-30"
          >
            {torchOn ? <Zap className="w-5 h-5 text-cockpit-amber" /> : <ZapOff className="w-5 h-5" />}
          </button>
        </div>

        <button
          onClick={handleManualEnter}
          disabled={reading}
          className="text-sm text-cockpit-muted active:scale-95 transition-transform disabled:opacity-40"
        >
          Enter reading manually
        </button>

        <p className="text-[11px] text-cockpit-muted/70 text-center max-w-xs">
          Readings are checked by AI — confirm before saving
        </p>
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleGalleryPick} />
      <canvas ref={canvasRef} className="hidden" />

      <style>{`
        @keyframes scanSweep {
          0% { top: 4px; opacity: 0.4; }
          50% { opacity: 1; }
          100% { top: calc(100% - 4px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}