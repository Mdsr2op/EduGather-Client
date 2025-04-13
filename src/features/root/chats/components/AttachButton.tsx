import React, { useRef, useState } from 'react';
import { FiPaperclip, FiLoader } from 'react-icons/fi';
import FilePreview from '../../messages/components/FilePreview';

interface AttachButtonProps {
  onFileSelect: (file: File, caption?: string) => void;
  isUploading?: boolean;
}

const AttachButton = ({ onFileSelect, isUploading = false }: AttachButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleAttachmentClick = () => {
    if (isUploading) return; // Prevent clicking while uploading
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowPreview(true);
    }
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSendFile = (file: File, caption: string) => {
    onFileSelect(file, caption);
    setShowPreview(false);
    setSelectedFile(null);
  };
  
  const handleCancelPreview = () => {
    setShowPreview(false);
    setSelectedFile(null);
  };
  
  const handleFileReplace = (newFile: File) => {
    setSelectedFile(newFile);
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
      />
      
      {/* Display file preview when a file is selected */}
      {showPreview && selectedFile && (
        <FilePreview 
          file={selectedFile}
          onSend={handleSendFile}
          onCancel={handleCancelPreview}
          onFileChange={handleFileReplace}
        />
      )}
    </>
  );
};

export default AttachButton;
