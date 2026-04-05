'use client';

import { useState, useRef } from 'react';
import { saveService } from '@/app/actions/adminServices';
import { ImageUploadInput } from './ImageUploadInput';

type MediaObj = { id: string; url: string; type: string };

type ServiceData = {
  id?: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  workers?: { id: string }[];
  medias?: MediaObj[];
};

interface ServiceModalProps {
  initialData?: ServiceData | null;
  onClose: () => void;
}

export function ServiceModal({ initialData, onClose }: ServiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorPayload, setErrorPayload] = useState<string | null>(null);

  const existingImage = initialData?.medias?.find(
    m => m.type === 'image' || m.url.match(/\.(jpeg|jpg|gif|png|webp)$/i)
  )?.url || '';

  // Track the most-recent image URL (either inherited or freshly uploaded)
  const [resolvedImageUrl, setResolvedImageUrl] = useState<string>(existingImage);

  // Ref to the uploader so we can lazily trigger the upload on submit
  const uploaderRef = useRef<{ triggerUpload: () => Promise<string | null> }>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorPayload(null);

    const formData = new FormData(e.currentTarget);

    // 1. Trigger image upload if a file was selected
    let imageUrl = resolvedImageUrl;
    if (uploaderRef.current) {
      const uploaded = await uploaderRef.current.triggerUpload();
      if (uploaded !== null) imageUrl = uploaded;
      // If upload returned null (error), abort save
      if (uploaded === null && !resolvedImageUrl) {
        setIsSubmitting(false);
        return;
      }
    }

    // 2. Save the service
    const data = {
      id: initialData?.id,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseInt(formData.get('price') as string, 10),
      duration: formData.get('duration') as string,
      imageUrl: imageUrl || undefined,
    };

    const result = await saveService(data);

    if (result.success) {
      onClose();
    } else {
      setErrorPayload(result.error || 'Failed to save');
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-gray-400 hover:text-white hover:bg-black/50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row w-full flex-grow">

          {/* LEFT COLUMN: Image Upload */}
          <div className="w-full md:w-[38%] bg-white/[0.02] border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col gap-4">
            <div>
              <h3 className="font-playfair text-xl text-gold mb-0.5">
                {initialData ? 'Edit Service' : 'New Service'}
              </h3>
              <p className="font-sans text-[10px] uppercase tracking-widest text-gray-500">Service Configuration</p>
            </div>

            {/* Wired uploader — exposes triggerUpload via imperative ref */}
            <ImageUploadInputWithRef
              ref={uploaderRef}
              currentImageUrl={existingImage}
              onUploadComplete={setResolvedImageUrl}
              label="Service Cover Photo"
            />
          </div>

          {/* RIGHT COLUMN: Form Fields */}
          <div className="w-full md:w-[62%] p-6 md:p-8 flex flex-col font-sans">

            {errorPayload && (
              <div className="mb-6 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorPayload}
              </div>
            )}

            <div className="flex flex-col gap-1.5 focus-within:text-gold text-gray-400 mb-5">
              <label htmlFor="name" className="uppercase tracking-wider text-[10px] pl-1 transition-colors">Service Name *</label>
              <input
                required id="name" name="name" type="text"
                defaultValue={initialData?.name}
                className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:bg-white/[0.08] focus:border-gold/50 transition-all text-sm"
                placeholder="e.g. Classic Full Set"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="flex flex-col gap-1.5 focus-within:text-gold text-gray-400">
                <label htmlFor="price" className="uppercase tracking-wider text-[10px] pl-1 transition-colors">Price (RWF) *</label>
                <input
                  required id="price" name="price" type="number" min="0" step="500"
                  defaultValue={initialData?.price}
                  className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:bg-white/[0.08] focus:border-gold/50 transition-all text-sm"
                  placeholder="25000"
                />
              </div>
              <div className="flex flex-col gap-1.5 focus-within:text-gold text-gray-400">
                <label htmlFor="duration" className="uppercase tracking-wider text-[10px] pl-1 transition-colors">Duration Estim. *</label>
                <input
                  required id="duration" name="duration" type="text"
                  defaultValue={initialData?.duration}
                  className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:bg-white/[0.08] focus:border-gold/50 transition-all text-sm"
                  placeholder="e.g. 1h 30m"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 focus-within:text-gold text-gray-400 mb-5 flex-grow">
              <label htmlFor="description" className="uppercase tracking-wider text-[10px] pl-1 transition-colors">Client Description *</label>
              <textarea
                required id="description" name="description" rows={6}
                defaultValue={initialData?.description}
                className="w-full flex-grow bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:bg-white/[0.08] focus:border-gold/50 transition-all text-sm resize-none leading-relaxed"
                placeholder="Describe the treatment clearly for your clients..."
              />
            </div>

            {/* Footer Actions */}
            <div className="pt-6 mt-auto border-t border-white/5 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors tracking-wide text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold text-charcoal hover:bg-gold/90 transition-all tracking-wide disabled:opacity-50 text-sm font-medium shadow-[0_0_15px_rgba(255,215,0,0.2)]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : 'Save Service'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Imperative Ref Wrapper
   Exposes triggerUpload() so the parent form can call upload
   at submit-time without having to render in a child form.
───────────────────────────────────────────────────────── */
import { forwardRef, useImperativeHandle } from 'react';

const ImageUploadInputWithRef = forwardRef<
  { triggerUpload: () => Promise<string | null> },
  { currentImageUrl?: string; onUploadComplete: (url: string) => void; label?: string }
>(function ImageUploadInputWithRef({ currentImageUrl, onUploadComplete, label }, ref) {
  const [preview, setPreview] = useState<string>(currentImageUrl || '');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    triggerUpload: async () => {
      if (!pendingFile) return currentImageUrl || null;
      setIsUploading(true);
      setError(null);
      try {
        const form = new FormData();
        form.append('file', pendingFile);
        const res = await fetch('/api/upload', { method: 'POST', body: form });
        const data = await res.json();
        if (!res.ok || !data.url) {
          setError(data.error || 'Upload failed.');
          return null;
        }
        onUploadComplete(data.url);
        setPendingFile(null);
        return data.url as string;
      } catch {
        setError('Network error during upload.');
        return null;
      } finally {
        setIsUploading(false);
      }
    }
  }));

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Only image files accepted.'); return; }
    if (file.size > 25 * 1024 * 1024) { setError('Max file size is 25MB.'); return; }
    setError(null);
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col gap-2 flex-grow">
      {label && <span className="text-gray-400 uppercase tracking-wider text-[10px] pl-1">{label}</span>}

      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
        className={`relative flex-grow min-h-[200px] rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 flex items-center justify-center group
          ${isDragging ? 'border-gold bg-gold/5 scale-[1.01]' : 'border-white/10 hover:border-white/25 bg-white/[0.03] hover:bg-white/[0.06]'}`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <span className="text-xs text-white/80 uppercase tracking-wider font-sans">Change Image</span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 pointer-events-none">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-gold/20' : 'bg-white/5'}`}>
              <svg className={`w-7 h-7 transition-colors ${isDragging ? 'text-gold' : 'text-white/30 group-hover:text-white/60'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/50 group-hover:text-white/80 transition-colors font-sans">
                {isDragging ? 'Drop to set image' : 'Click or drag a photo'}
              </p>
              <p className="text-[10px] text-white/20 mt-1 font-sans">JPG · PNG · WebP — max 25MB</p>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
            <svg className="w-8 h-8 text-gold animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-xs text-white/60 font-sans">Uploading image…</p>
          </div>
        )}
      </div>

      {error && <p className="text-[11px] text-red-400 font-sans pl-1">{error}</p>}
      {pendingFile && !isUploading && (
        <p className="text-[11px] text-gold/70 font-sans pl-1 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          {pendingFile.name} — will upload on save
        </p>
      )}

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
});
