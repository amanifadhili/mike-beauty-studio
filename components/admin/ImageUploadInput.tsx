'use client';

import { useState, useRef } from 'react';

interface ImageUploadInputProps {
  /** The initial/existing image URL (for edit scenarios) */
  currentImageUrl?: string;
  /** Callback fired with the final hosted URL after a successful upload */
  onUploadComplete: (url: string) => void;
  /** Optional label text shown above the zone */
  label?: string;
}

/**
 * A reusable drag-and-drop/click-to-pick image uploader.
 * - Shows instant live preview via createObjectURL.
 * - Fires a POST to /api/upload and returns the hosted URL via onUploadComplete.
 * - Also exposes a `getUploadedUrl()` approach: call upload on-save for lazy upload.
 */
export function ImageUploadInput({ currentImageUrl, onUploadComplete, label = 'Cover Image' }: ImageUploadInputProps) {
  const [preview, setPreview] = useState<string>(currentImageUrl || '');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are accepted.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setError('Image is too large. Max size is 25MB.');
      return;
    }
    setError(null);
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  /**
   * Call this from the parent form's submit handler.
   * If a new file is pending, uploads it and returns the permanent URL.
   * If no new file selected, returns the existing URL unchanged.
   */
  const triggerUpload = async (): Promise<string | null> => {
    if (!pendingFile) return currentImageUrl || null;

    setIsUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append('file', pendingFile);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || 'Upload failed. Please try again.');
        return null;
      }
      const hostedUrl = data.url as string;
      onUploadComplete(hostedUrl);
      setPendingFile(null);
      return hostedUrl;
    } catch {
      setError('Network error during upload. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-gray-400 uppercase tracking-wider text-[10px] pl-1">{label}</span>
      )}

      {/* Drop Zone / Preview Box */}
      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative w-full aspect-square rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 flex items-center justify-center group
          ${isDragging ? 'border-gold bg-gold/5 scale-[1.01]' : 'border-white/10 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.06]'}`}
      >
        {/* Live Preview */}
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            {/* Hover overlay - Change Image */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-xs text-white/80 tracking-wider uppercase font-sans">Change Image</span>
            </div>
          </>
        ) : (
          /* Upload Prompt */
          <div className="flex flex-col items-center gap-3 p-4 pointer-events-none">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-gold/20' : 'bg-white/5'}`}>
              <svg className={`w-7 h-7 transition-colors ${isDragging ? 'text-gold' : 'text-white/30 group-hover:text-white/60'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/50 group-hover:text-white/80 transition-colors font-sans">
                {isDragging ? 'Drop to set image' : 'Click or drag photo here'}
              </p>
              <p className="text-[10px] text-white/20 mt-1 font-sans">JPG, PNG, WebP — max 25MB</p>
            </div>
          </div>
        )}

        {/* Uploading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
            <svg className="w-8 h-8 text-gold animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-xs text-white/60 font-sans">Uploading...</p>
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <p className="text-[11px] text-red-400 font-sans pl-1">{error}</p>
      )}
      {pendingFile && !isUploading && (
        <p className="text-[11px] text-gold/70 font-sans pl-1 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold/70 animate-pulse" />
          {pendingFile.name} — ready to upload on save
        </p>
      )}

      {/* Hidden native file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}

// Export the trigger function type for parent use
export type { ImageUploadInputProps };
