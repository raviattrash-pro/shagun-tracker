'use client';

/**
 * useCamera — Hook for capturing guest photos using the device camera.
 *
 * Uses getUserMedia directly (no react-webcam dependency required).
 * Provides open/close, capture, and front/rear toggle.
 */

import { useCallback, useRef, useState } from 'react';

export interface UseCameraReturn {
  /** Whether the camera feed is currently open */
  isCameraOpen: boolean;
  /** Open the camera (requests permission) */
  openCamera: () => Promise<void>;
  /** Close the camera and release the stream */
  closeCamera: () => void;
  /** Capture a still photo and return a data URL */
  capturePhoto: () => string | null;
  /** Toggle between front and rear cameras */
  switchCamera: () => Promise<void>;
  /** Error message (e.g. permission denied) */
  cameraError: string | null;
  /** Ref to attach to a <video> element */
  videoRef: React.RefObject<HTMLVideoElement | null>;
  /** Current facing mode */
  facingMode: 'user' | 'environment';
}

export function useCamera(): UseCameraReturn {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ── helpers ──

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startStream = useCallback(
    async (facing: 'user' | 'environment') => {
      stopStream();
      setCameraError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Camera API is not supported in this browser.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setIsCameraOpen(true);
      } catch (err) {
        const msg =
          err instanceof DOMException && err.name === 'NotAllowedError'
            ? 'Camera permission was denied. Please enable it in your browser settings.'
            : 'Could not access the camera.';
        setCameraError(msg);
        setIsCameraOpen(false);
      }
    },
    [stopStream],
  );

  // ── public API ──

  const openCamera = useCallback(async () => {
    await startStream(facingMode);
  }, [facingMode, startStream]);

  const closeCamera = useCallback(() => {
    stopStream();
    setIsCameraOpen(false);
  }, [stopStream]);

  const capturePhoto = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || !isCameraOpen) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  }, [isCameraOpen]);

  const switchCamera = useCallback(async () => {
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    if (isCameraOpen) {
      await startStream(next);
    }
  }, [facingMode, isCameraOpen, startStream]);

  return {
    isCameraOpen,
    openCamera,
    closeCamera,
    capturePhoto,
    switchCamera,
    cameraError,
    videoRef,
    facingMode,
  };
}
