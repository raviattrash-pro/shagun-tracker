'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Camera, Upload, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/utils/cn';
import { stringToColor } from '@/utils/format';

interface GuestPhotoProps {
  photoUrl?: string | null;
  guestName: string;
  onPhotoChange: (file: File | string | null) => void;
  className?: string;
}

export const GuestPhoto: React.FC<GuestPhotoProps> = ({
  photoUrl,
  guestName,
  onPhotoChange,
  className,
}) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 400, height: 400 },
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Unable to access camera. Please check permissions or upload an image.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureCameraPhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, 400, 400);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onPhotoChange(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoChange(file);
    }
  };

  const initials = guestName
    ? guestName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '?';

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {isCameraActive ? (
        <div className="relative h-44 w-44 overflow-hidden rounded-full border-4 border-amber-400 shadow-xl bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={captureCameraPhoto}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3"
            >
              Snap
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={stopCamera}
              className="rounded-full text-xs px-3"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <Avatar className="h-28 w-28 border-4 border-amber-400/80 shadow-lg">
            {photoUrl && <AvatarImage src={photoUrl} alt={guestName} className="object-cover" />}
            <AvatarFallback
              style={{ backgroundColor: stringToColor(guestName || 'guest') }}
              className="text-white text-2xl font-bold font-serif"
            >
              {initials}
            </AvatarFallback>
          </Avatar>

          {photoUrl && (
            <button
              type="button"
              onClick={() => onPhotoChange(null)}
              className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-destructive text-white shadow hover:bg-red-700 transition"
              title="Remove photo"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {!isCameraActive && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={startCamera}
            className="text-xs gap-1.5 rounded-full"
          >
            <Camera className="h-3.5 w-3.5 text-amber-600" />
            <span>Camera</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs gap-1.5 rounded-full"
          >
            <Upload className="h-3.5 w-3.5 text-blue-600" />
            <span>Upload</span>
          </Button>
        </div>
      )}
    </div>
  );
};
