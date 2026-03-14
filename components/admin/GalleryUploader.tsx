'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { addGalleryMedia } from '@/app/actions/adminGallery';

type ServiceCategory = {
  id: string;
  name: string;
};

type UploadedFile = {
  file: File;
  preview: string;
  uploading: boolean;
  progress: number;
  url?: string;
  type?: string;
  error?: string;
};

export function GalleryUploader({ availableServices }: { availableServices: ServiceCategory[] }) {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [serviceId, setServiceId] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
    const newItems: UploadedFile[] = Array.from(files)
      .filter(f => validTypes.includes(f.type))
      .map(f => ({
        file: f,
        preview: f.type.startsWith('image') ? URL.createObjectURL(f) : '',
        uploading: false,
        progress: 0,
      }));
    setSelectedFiles(prev => [...prev, ...newItems]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const removeFile = (idx: number) => {
    setSelectedFiles(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleUploadAll = async () => {
    if (!serviceId) {
      alert('Please select a category first.');
      return;
    }
    if (selectedFiles.length === 0) return;

    setIsSubmitting(true);
    let successCounter = 0;
    const selectedService = availableServices.find(s => s.id === serviceId);
    const categoryName = selectedService?.name || 'Uncategorized';

    const updatedFiles = [...selectedFiles];

    for (let i = 0; i < updatedFiles.length; i++) {
      const item = updatedFiles[i];
      updatedFiles[i] = { ...item, uploading: true, progress: 10 };
      setSelectedFiles([...updatedFiles]);

      try {
        // Step 1: Upload to disk via API
        const uploadForm = new FormData();
        uploadForm.append('file', item.file);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadForm,
        });

        updatedFiles[i] = { ...updatedFiles[i], progress: 60 };
        setSelectedFiles([...updatedFiles]);

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          updatedFiles[i] = { ...updatedFiles[i], uploading: false, error: err.error || 'Upload failed.' };
          setSelectedFiles([...updatedFiles]);
          continue;
        }

        const { url, type } = await uploadRes.json();

        // Step 2: Save to database
        const dbResult = await addGalleryMedia({ url, type, category: categoryName, serviceId });
        
        updatedFiles[i] = { ...updatedFiles[i], progress: 100, uploading: false };
        setSelectedFiles([...updatedFiles]);
        
        if (dbResult.success) {
          successCounter++;
        } else {
          updatedFiles[i] = { ...updatedFiles[i], error: 'Saved to disk but DB insert failed.' };
          setSelectedFiles([...updatedFiles]);
        }
      } catch {
        updatedFiles[i] = { ...updatedFiles[i], uploading: false, error: 'Network error during upload.' };
        setSelectedFiles([...updatedFiles]);
      }
    }

    setSuccessCount(prev => prev + successCounter);
    setIsSubmitting(false);

    // Clear successfully uploaded items after a brief delay
    setTimeout(() => {
      setSelectedFiles(prev => prev.filter(f => f.progress < 100));
    }, 1500);
  };

  return (
    <div className="admin-surface-alt border border-white/5 p-4 sm:p-8 mb-12 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-playfair text-xl text-white">Upload New Media</h3>
        {successCount > 0 && (
          <span className="text-xs font-sans text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1">
            ✓ {successCount} file{successCount !== 1 ? 's' : ''} added
          </span>
        )}
      </div>

      {/* Category Selector */}
      <div className="flex flex-col gap-1">
        <label className="text-gray-400 uppercase tracking-wider text-xs font-sans">
          Category <span className="text-red-400">*</span>
        </label>
        <select
          value={serviceId}
          onChange={e => setServiceId(e.target.value)}
          className="w-full max-w-xs admin-input border-none border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors font-sans"
        >
          <option value="">— Select a Category —</option>
          {availableServices.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-md p-10 text-center transition-colors cursor-pointer ${
          isDragging
            ? 'border-gold bg-gold/5'
            : 'border-white/15 hover:border-white/30'
        }`}
        onClick={() => document.getElementById('gallery-file-input')?.click()}
      >
        <input
          id="gallery-file-input"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
          className="hidden"
          onChange={e => addFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          <svg className="w-12 h-12 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v8" />
          </svg>
          <p className="text-white font-sans">Drag & drop files here, or <span className="text-gold">click to browse</span></p>
          <p className="text-gray-500 text-xs font-sans">JPG, PNG, WebP, GIF, MP4, WebM • Max 25MB each</p>
        </div>
      </div>

      {/* Preview Grid */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {selectedFiles.map((item, i) => (
              <div key={i} className="relative aspect-square admin-input border-none group overflow-hidden">
                
                {item.preview ? (
                  <Image src={item.preview} alt="preview" fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gold/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* Progress overlay */}
                {item.uploading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="w-12 h-12">
                      <svg className="animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#C9A84C" strokeWidth="3"/>
                        <path className="opacity-75" fill="#C9A84C" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    </div>
                  </div>
                )}

                {/* Success state */}
                {item.progress === 100 && !item.error && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                {/* Error state */}
                {item.error && (
                  <div className="absolute inset-0 bg-red-900/80 flex items-end justify-center p-2">
                    <p className="text-red-200 text-[9px] font-sans text-center leading-tight">{item.error}</p>
                  </div>
                )}

                {/* File name + remove (idle state) */}
                {!item.uploading && item.progress === 0 && (
                  <>
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1.5 translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-[9px] text-white font-sans truncate">{item.file.name}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                      className="absolute top-1 right-1 bg-black/70 hover:bg-red-600/90 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleUploadAll}
              disabled={isSubmitting || selectedFiles.length === 0}
              className="px-8 py-3 bg-gold text-charcoal font-sans tracking-wide hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`}
            </button>
            <button
              onClick={() => setSelectedFiles([])}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-white text-sm font-sans transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
