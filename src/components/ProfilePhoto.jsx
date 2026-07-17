import React, { useState, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Loader2 } from "lucide-react";
import Avatar from "@/components/Avatar";
import BottomSheet from "@/components/BottomSheet";
import Cropper from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import cropImage from "@/lib/cropImage";

export default function ProfilePhoto({ pilot, onUpdated }) {
  const { toast } = useToast();
  const fileRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleUse = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const blob = await cropImage(imageSrc, croppedAreaPixels);
      const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.Pilot.update(pilot.id, { avatar_url: file_url });
      toast({ title: "Photo updated" });
      setImageSrc(null);
      onUpdated?.();
    } catch {
      toast({ title: "Failed to upload photo", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    try {
      await base44.entities.Pilot.update(pilot.id, { avatar_url: "" });
      toast({ title: "Photo removed" });
      onUpdated?.();
    } catch {
      toast({ title: "Failed to remove photo", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mb-4">
      <Avatar pilot={pilot} size={88} />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cockpit-panel border border-cockpit-border text-cockpit-cream text-sm font-medium active:scale-95 transition-transform disabled:opacity-50"
      >
        <Camera className="w-4 h-4" />
        Change photo
      </button>
      {pilot?.avatar_url && (
        <button
          type="button"
          onClick={handleRemove}
          disabled={uploading}
          className="text-xs text-cockpit-muted active:scale-95 transition-transform disabled:opacity-50"
        >
          Remove photo
        </button>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPick} />

      {imageSrc && (
        <BottomSheet onClose={() => !uploading && setImageSrc(null)}>
          <h3 className="font-heading font-bold text-cockpit-cream text-lg mb-4">Crop photo</h3>
          <div className="relative w-full rounded-full overflow-hidden bg-cockpit-bg mb-5"
               style={{ aspectRatio: "1 / 1", maxHeight: 340 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="px-1 mb-6">
            <p className="text-xs text-cockpit-muted mb-2">Zoom</p>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(v) => setZoom(v[0])}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setImageSrc(null)}
              disabled={uploading}
              className="flex-1 py-3 rounded-xl border border-cockpit-border bg-cockpit-panel text-cockpit-cream text-sm font-medium disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUse}
              disabled={uploading}
              className="flex-1 py-3 rounded-xl bg-cockpit-amber text-cockpit-bg text-sm font-bold flex items-center justify-center disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Use photo"}
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}