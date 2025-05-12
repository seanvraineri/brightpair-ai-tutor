import React, { useState, useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { uploadPdf } from '@/services/homeworkService';

interface PdfUploaderProps {
  onUploadComplete: (pdfUrl: string, file: File) => void;
  onUploadStart?: () => void;
  onError?: (error: string) => void;
}

const PdfUploader: React.FC<PdfUploaderProps> = ({ 
  onUploadComplete, 
  onUploadStart,
  onError
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Handle file drop
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      onError?.('Only PDF files are allowed');
      return;
    }
    
    // Check if file is too large (10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError?.('File size must be less than 10MB');
      return;
    }
    
    await handleUpload(file);
  }, [onError, onUploadComplete]);
  
  // Handle file selection through input
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is a PDF
    if (file.type !== 'application/pdf') {
      onError?.('Only PDF files are allowed');
      return;
    }
    
    // Check if file is too large (10MB)
    if (file.size > 10 * 1024 * 1024) {
      onError?.('File size must be less than 10MB');
      return;
    }
    
    await handleUpload(file);
  }, [onError, onUploadComplete]);
  
  // Upload file
  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      onUploadStart?.();
      
      // Upload file
      const pdfUrl = await uploadPdf(file);
      
      if (!pdfUrl) {
        throw new Error('Failed to upload PDF');
      }
      
      setUploadedFile(file);
      onUploadComplete(pdfUrl, file);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Remove uploaded file
  const handleRemoveFile = () => {
    setUploadedFile(null);
  };
  
  return (
    <div className="w-full">
      {!uploadedFile ? (
        <div
          className={`border-2 border-dashed rounded-md p-6 transition-colors ${
            isDragging ? 'border-brightpair bg-brightpair-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-2">
              {isDragging ? 'Drop PDF here' : 'Drag & drop PDF or'}
            </p>
            <div className="relative">
              <input
                type="file"
                id="pdf-upload"
                className="sr-only"
                accept="application/pdf"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('pdf-upload')?.click()}
                disabled={isUploading}
                className="border-gray-300"
              >
                {isUploading ? 'Uploading...' : 'Browse Files'}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PDF files only. Max 10MB.
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="h-8 w-8 text-gray-400 mr-2" />
              <div>
                <p className="font-medium text-sm">{uploadedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(uploadedFile.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveFile}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUploader; 