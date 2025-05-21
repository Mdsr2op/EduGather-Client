import React, { useState, useCallback, useEffect } from 'react';
import { FiX, FiSend, FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import { IoDocumentOutline } from 'react-icons/io5';
import { useDropzone } from 'react-dropzone';
import './attachment.css';

interface FilePreviewProps {
  files: File[];
  onSend: (files: File[], caption: string) => void;
  onCancel: () => void;
  onFileChange?: (newFiles: File[]) => void;
  onRemoveFile?: (indexToRemove: number) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ 
  files, 
  onSend, 
  onCancel, 
  onFileChange,
  onRemoveFile 
}) => {
  const [caption, setCaption] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewUrls, setPreviewUrls] = useState<string[]>(() => {
    return files.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });
  });

  // Add a global style to disable file context menu behavior
  useEffect(() => {
    // Add a style tag to disable selection and dragging
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .file-preview-container * {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        user-select: none !important;
        -webkit-user-select: none !important;
      }
    `;
    document.head.appendChild(styleElement);

    // Cleanup function to remove the style tag when component unmounts
    return () => {
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const currentFile = files[currentIndex];
  const isImage = currentFile.type.startsWith('image/');
  const isVideo = currentFile.type.startsWith('video/');
  const fileSize = (currentFile.size / (1024 * 1024)).toFixed(2);

  // Clean up the object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previewUrls]);

  const handleSend = () => {
    onSend(files, caption);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveFile) {
      onRemoveFile(currentIndex);
      // If this was the last file, go to previous one
      if (currentIndex === files.length - 1 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex(prev => (prev < files.length - 1 ? prev + 1 : prev));
  };

  // Prevent default browser context menu on the entire component
  const preventDefaultAction = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Set up dropzone for adding more files
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      // Only add files up to a maximum of 5 total
      const filesToAdd = acceptedFiles.slice(0, 5 - files.length);
      
      if (filesToAdd.length === 0) return;
      
      // Create new preview URLs for image files
      const newPreviewUrls = filesToAdd.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return '';
      });
      
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      
      // Notify parent component if callback provided
      if (onFileChange) {
        onFileChange([...files, ...filesToAdd]);
      }
    }
  }, [files, onFileChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    maxFiles: 5 - files.length,
    noClick: isImage || isVideo // Disable click when there's already a preview
  });

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 file-preview-container"
      onContextMenu={preventDefaultAction}
    >
      <div 
        className="bg-dark-2 dark:bg-dark-2 light:bg-light-bg-2 rounded-lg w-full max-w-xl max-h-[90vh] flex flex-col"
        onContextMenu={preventDefaultAction}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-dark-4 dark:border-dark-4 light:border-light-bg-4">
          <h3 className="text-light-1 dark:text-light-1 light:text-light-text-1 text-lg font-medium">
            File Preview ({currentIndex + 1}/{files.length})
          </h3>
          <button 
            onClick={onCancel}
            className="text-light-3 dark:text-light-3 light:text-light-text-3 hover:text-light-1 dark:hover:text-light-1 light:hover:text-light-text-1"
            aria-label="Close"
          >
            <FiX size={24} />
          </button>
        </div>
        
        {/* Preview Area with Dropzone */}
        <div 
          {...getRootProps()} 
          className={`flex-1 overflow-auto p-4 relative ${isDragActive ? 'bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 border-2 border-dashed border-primary-500' : ''}`}
          onContextMenu={preventDefaultAction}
        >
          <input {...getInputProps()} />
          {isDragActive && (
            <div className="absolute inset-0 bg-dark-1 dark:bg-dark-1 light:bg-light-bg-1 bg-opacity-70 flex items-center justify-center z-10">
              <p className="text-light-1 dark:text-light-1 light:text-light-text-1 text-xl">Drop to add more files (max 5)</p>
            </div>
          )}
          
          <div className="flex flex-col items-center justify-center">
            {/* Navigation buttons */}
            <div className="w-full flex justify-between items-center mb-4">
              <button 
                onClick={goToPrevious}
                onMouseDown={(e) => e.preventDefault()}
                disabled={currentIndex === 0}
                className={`p-2 rounded-full ${currentIndex === 0 ? 'text-light-4 dark:text-light-4 light:text-light-text-4 cursor-not-allowed' : 'text-light-1 dark:text-light-1 light:text-light-text-1 hover:bg-dark-3 dark:hover:bg-dark-3 light:hover:bg-light-bg-3'}`}
                onContextMenu={preventDefaultAction}
              >
                <FiChevronLeft size={24} />
              </button>
              
              <button
                onClick={handleRemoveFile}
                onMouseDown={(e) => e.preventDefault()}
                className="text-red-500 hover:text-red-400 flex items-center"
                onContextMenu={preventDefaultAction}
              >
                <FiTrash2 size={18} />
                <span className="ml-1">Remove</span>
              </button>
              
              <button 
                onClick={goToNext}
                onMouseDown={(e) => e.preventDefault()}
                disabled={currentIndex === files.length - 1}
                className={`p-2 rounded-full ${currentIndex === files.length - 1 ? 'text-light-4 dark:text-light-4 light:text-light-text-4 cursor-not-allowed' : 'text-light-1 dark:text-light-1 light:text-light-text-1 hover:bg-dark-3 dark:hover:bg-dark-3 light:hover:bg-light-bg-3'}`}
                onContextMenu={preventDefaultAction}
              >
                <FiChevronRight size={24} />
              </button>
            </div>
            
            {isImage ? (
              <img 
                src={previewUrls[currentIndex]} 
                alt={currentFile.name} 
                className="max-h-[40vh] max-w-full object-contain rounded-lg"
                onContextMenu={preventDefaultAction}
                onClick={preventDefaultAction}
                draggable={false}
              />
            ) : isVideo ? (
              <video 
                src={URL.createObjectURL(currentFile)} 
                controls 
                className="max-h-[40vh] max-w-full rounded-lg"
                onContextMenu={preventDefaultAction}
                onClick={(e) => e.stopPropagation()}
                draggable={false}
              />
            ) : (
              <div 
                className="py-8 flex flex-col items-center"
                onContextMenu={preventDefaultAction}
              >
                <div className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 p-6 rounded-full mb-4">
                  {currentFile.type.includes('pdf') ? (
                    <IoDocumentOutline size={48} className="text-red-500" />
                  ) : currentFile.type.includes('word') || currentFile.type.includes('doc') ? (
                    <IoDocumentOutline size={48} className="text-blue-500" />
                  ) : currentFile.type.includes('excel') || currentFile.type.includes('sheet') ? (
                    <IoDocumentOutline size={48} className="text-green-500" />
                  ) : (
                    <IoDocumentOutline size={48} className="text-gray-400" />
                  )}
                </div>
                <div className="text-center">
                  <h4 className="text-light-1 dark:text-light-1 light:text-light-text-1 text-lg font-medium truncate max-w-xs">{currentFile.name}</h4>
                  <p className="text-light-3 dark:text-light-3 light:text-light-text-3 text-sm">{fileSize} MB</p>
                </div>
              </div>
            )}
            
            <div className="w-full mt-4">
              <p className="text-light-3 dark:text-light-3 light:text-light-text-3 text-sm mb-2">File details:</p>
              <div className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 p-3 rounded-lg">
                <p className="text-light-1 dark:text-light-1 light:text-light-text-1 truncate">{currentFile.name}</p>
                <p className="text-light-3 dark:text-light-3 light:text-light-text-3 text-sm">{fileSize} MB • {currentFile.type || 'Unknown type'}</p>
              </div>
            </div>
            
            {/* File thumbnails/indicators */}
            {files.length > 1 && (
              <div className="flex items-center justify-center mt-4 space-x-2">
                {files.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onContextMenu={preventDefaultAction}
                    className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-primary-500' : 'bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4'}`}
                    aria-label={`Go to file ${index + 1}`}
                  />
                ))}
              </div>
            )}
            
            {files.length < 5 && (
              <p className="text-light-3 dark:text-light-3 light:text-light-text-3 text-sm mt-4">
                Drag and drop more files here ({files.length}/5 selected)
              </p>
            )}
          </div>
        </div>
        
        {/* Caption Input */}
        <div className="p-4 border-t border-dark-4 dark:border-dark-4 light:border-light-bg-4">
          <div className="flex items-center bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Add a caption for all files..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="flex-grow bg-transparent text-light-1 dark:text-light-1 light:text-light-text-1 placeholder-light-3 dark:placeholder-light-3 light:placeholder-light-text-3 focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="ml-2 text-primary-500 hover:text-primary-600"
              aria-label="Send"
              disabled={files.length === 0}
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