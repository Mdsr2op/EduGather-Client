import React, { useRef, useState } from 'react';
import { FiPaperclip, FiLoader } from 'react-icons/fi';
import FilePreview from '../../messages/components/FilePreview';

interface AttachButtonProps {
  onFileSelect: (files: File[], caption?: string) => Promise<void> | void;
  isUploading?: boolean;
}

const AttachButton = ({ onFileSelect, isUploading = false }: AttachButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleAttachmentClick = () => {
    if (isUploading) return; // Prevent clicking while uploading
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    
    if (newFiles.length > 0) {
      // Only add files up to a maximum of 5 total
      const filesToAdd = newFiles.slice(0, 5 - selectedFiles.length);
      
      if (filesToAdd.length > 0) {
        setSelectedFiles(prev => [...prev, ...filesToAdd]);
        setShowPreview(true);
      }
    }
    
    // Reset the input value so the same files can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSendFiles = (files: File[], caption: string) => {
    onFileSelect(files, caption);
    setShowPreview(false);
    setSelectedFiles([]);
  };
  
  const handleCancelPreview = () => {
    setShowPreview(false);
    setSelectedFiles([]);
  };
  
  const handleFilesChange = (newFiles: File[]) => {
    setSelectedFiles(newFiles);
  };
  
  const handleRemoveFile = (indexToRemove: number) => {
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(indexToRemove, 1);
      return newFiles;
    });
    
    // If no files left, close the preview
    if (selectedFiles.length === 1) {
      setShowPreview(false);
    }
  };

  return (
    <>
      <button
        className={`${isUploading ? 'text-primary-500 animate-pulse' : 'text-light-3 hover:text-light-1'} flex-shrink-0 mr-2`}
        aria-label="Attach File"
        onClick={handleAttachmentClick}
        disabled={isUploading}
      >
        {isUploading ? (
          <div className="animate-spin">
            <FiLoader size={20} />
          </div>
        ) : (
          <FiPaperclip size={20} />
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        disabled={isUploading}
        multiple
      />
      
      {/* Display file preview when files are selected */}
      {showPreview && selectedFiles.length > 0 && (
        <FilePreview 
          files={selectedFiles}
          onSend={handleSendFiles}
          onCancel={handleCancelPreview}
          onFileChange={handleFilesChange}
          onRemoveFile={handleRemoveFile}
        />
      )}
    </>
  );
};

export default AttachButton;
