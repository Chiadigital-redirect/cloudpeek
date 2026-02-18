'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';

interface Props {
  onImageReady: (base64: string) => void;
  disabled?: boolean;
}

export default function CloudCamera({ onImageReady, disabled }: Props) {
  const fileInputRef  = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string;
      setPreview(result);
      onImageReady(result);
    };
    reader.readAsDataURL(file);
  }, [onImageReady]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const clear = () => {
    setPreview(null);
    if (fileInputRef.current)  fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">

      {/* Preview */}
      {preview ? (
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-square">
          <Image src={preview} alt="Cloud preview" fill style={{ objectFit: 'cover' }} />
          <button
            onClick={clear}
            className="absolute top-3 right-3 bg-white/80 backdrop-blur rounded-full w-9 h-9 flex items-center justify-center text-red-500 font-black text-lg shadow hover:bg-white transition"
            aria-label="Remove photo"
          >
            ✕
          </button>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-sky-900/60 to-transparent p-3">
            <p className="text-white font-bold text-sm text-center">Looking great! Hit Identify ↓</p>
          </div>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            relative rounded-3xl border-4 border-dashed aspect-square
            flex flex-col items-center justify-center gap-3
            transition-all cursor-pointer select-none
            ${dragging
              ? 'border-sky-400 bg-sky-100/80 scale-105'
              : 'border-sky-300 bg-white/30 hover:bg-white/50'}
          `}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
          aria-label="Upload a cloud photo"
        >
          <span className="text-6xl">🌤️</span>
          <p className="font-black text-sky-700 text-lg text-center px-4">
            Drag a sky photo<br />or tap to pick
          </p>
          <p className="text-sky-500 text-sm font-semibold">JPG, PNG, WEBP supported</p>
        </div>
      )}

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3">
        {/* Camera (mobile) */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          disabled={disabled}
          className="
            flex flex-col items-center gap-1 py-4 px-3 rounded-2xl
            bg-yellow-400 hover:bg-yellow-300 active:scale-95
            font-black text-white text-base shadow-lg
            transition-all disabled:opacity-50 min-h-[72px]
          "
        >
          <span className="text-2xl">📷</span>
          <span>Take Photo</span>
        </button>

        {/* Gallery */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="
            flex flex-col items-center gap-1 py-4 px-3 rounded-2xl
            bg-sky-400 hover:bg-sky-300 active:scale-95
            font-black text-white text-base shadow-lg
            transition-all disabled:opacity-50 min-h-[72px]
          "
        >
          <span className="text-2xl">🖼️</span>
          <span>Gallery</span>
        </button>
      </div>

      {/* Hidden inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0] ?? null)}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0] ?? null)}
      />
    </div>
  );
}
