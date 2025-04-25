import React, { useState, useCallback } from 'react';
import { FiX, FiSend } from 'react-icons/fi';
import { IoDocumentOutline } from 'react-icons/io5';
import { useDropzone } from 'react-dropzone';
import './attachment.css';

interface FilePreviewProps {
  file: File;
  onSend: (file: File, caption: string) => void;
  onCancel: () => void;
  onFileChange?: (newFile: File) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onSend, onCancel, onFileChange }) => {
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string>(() => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return '';
  });

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const fileSize = (file.size / (1024 * 1024)).toFixed(2);

  // Clean up the object URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSend = () => {
    onSend(file, caption);
  };

  // Set up dropzone for replacing the current file
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const newFile = acceptedFiles[0];
      
      // Clean up previous preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Create new preview URL if it's an image
      if (newFile.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(newFile));
      } else {
        setPreviewUrl('');
      }
      
      // Notify parent component if callback provided
      if (onFileChange) {
        onFileChange(newFile);
      }
    }
  }, [previewUrl, onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 1,
    noClick: isImage || isVideo // Disable click when there's already a preview
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-dark-2 rounded-lg w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-dark-4">
          <h3 className="text-light-1 text-lg font-medium">File Preview</h3>
          <button 
            onClick={onCancel}
            className="text-light-3 hover:text-light-1"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>
        
        {/* Preview Area with Dropzone */}
        <div 
          {...getRootProps()} 
          className={`flex-1 overflow-auto p-4 ${isDragActive ? 'bg-dark-4 border-2 border-dashed border-primary-500' : ''}`}
        >
          <input {...getInputProps()} />
          {isDragActive && (
            <div className="absolute inset-0 bg-dark-1 bg-opacity-70 flex items-center justify-center z-10">
              <p className="text-light-1 text-xl">Drop to replace current file</p>
            </div>
          )}
          
          <div className="flex flex-col items-center justify-center">
            {isImage ? (
              <img 
                src={previewUrl} 
                alt={file.name} 
                className="max-h-[50vh] max-w-full object-contain rounded-lg"
              />
            ) : isVideo ? (
              <video 
                src={URL.createObjectURL(file)} 
                controls 
                className="max-h-[50vh] max-w-full rounded-lg"
              />
            ) : (
              <div className="py-8 flex flex-col items-center">
                <div className="bg-dark-3 p-6 rounded-full mb-4">
                  {file.type.includes('pdf') ? (
                    <IoDocumentOutline size={48} className="text-red-500" />
                  ) : file.type.includes('word') || file.type.includes('doc') ? (
                    <IoDocumentOutline size={48} className="text-blue-500" />
                  ) : file.type.includes('excel') || file.type.includes('sheet') ? (
                    <IoDocumentOutline size={48} className="text-green-500" />
                  ) : (
                    <IoDocumentOutline size={48} className="text-gray-400" />
                  )}
                </div>
                <div className="text-center">
                  <h4 className="text-light-1 text-lg font-medium truncate max-w-xs">{file.name}</h4>
                  <p className="text-light-3 text-sm">{fileSize} MB</p>
                </div>
              </div>
            )}
            
            <div className="w-full mt-4">
              <p className="text-light-3 text-sm mb-2">File details:</p>
              <div className="bg-dark-3 p-3 rounded-lg">
                <p className="text-light-1 truncate">{file.name}</p>
                <p className="text-light-3 text-sm">{fileSize} MB • {file.type || 'Unknown type'}</p>
              </div>
            </div>
            
            {!isImage && !isVideo && (
              <p className="text-light-3 text-sm mt-4">
                Drag and drop a new file here to replace the current one
              </p>
            )}
          </div>
        </div>
        
        {/* Caption Input */}
        <div className="p-4 border-t border-dark-4">
          <div className="flex items-center bg-dark-3 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="flex-grow bg-transparent text-light-1 placeholder-light-3 focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="ml-2 text-primary-500 hover:text-primary-600"
              aria-label="Send"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview; 