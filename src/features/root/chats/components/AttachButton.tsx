import React, { useRef } from 'react';
import { FiPaperclip } from 'react-icons/fi';

const AttachButton = ({ onFileSelect }: { onFileSelect: (file: File) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };
  

  return (
    <>
      <button
        className="text-light-3 hover:text-light-1 flex-shrink-0 mr-2"
        aria-label="Attach File"
        onClick={handleAttachmentClick}
      >
        <FiPaperclip size={20} />
      </button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
};

export default AttachButton;
