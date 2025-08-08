'use client';
import React, { useState, useRef } from 'react';
import { Button } from '@/app/ui';

type FileUploadProps = {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  currentValue?: string;
  className?: string;
};

export default function FileUpload({ 
  onFileSelect, 
  accept = "image/*", 
  label = "Seleccionar archivo",
  currentValue,
  className = ""
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentValue || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file) {
      // Crear preview para imágenes
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-lime-500 bg-lime-50 dark:bg-lime-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-lime-400'
          }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        
        {preview ? (
          <div className="space-y-2">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-h-20 mx-auto rounded"
            />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clic para cambiar archivo
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 text-gray-400">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Arrastra y suelta o <span className="text-lime-600 font-medium">haz clic</span> para subir
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {accept}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {currentValue && !preview && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Archivo actual: {currentValue}
        </div>
      )}
    </div>
  );
}
