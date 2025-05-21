import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageAttachmentProps } from '../../types/messageTypes';
import { saveAs } from 'file-saver';
import MeetingAttachment from '../MeetingAttachment';
import ImageViewer from '../ImageViewer';
import { FiDownload, FiFile, FiImage, FiVideo, FiFileText, FiPackage, 
          FiBarChart2, FiCode, FiMusic, FiCalendar } from 'react-icons/fi';

const MessageAttachment: React.FC<MessageAttachmentProps> = ({ attachment, isUserMessage }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Determine the type of attachment
  const isImageAttachment = attachment.fileType?.startsWith('image/');
  const isVideoAttachment = attachment.fileType?.startsWith('video/');
  const isMeetingAttachment = attachment.fileType === 'application/meeting';
  const isAudioAttachment = attachment.fileType?.startsWith('audio/');

  // Function to simulate download progress - in real app this would track actual progress
  const simulateDownloadProgress = () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDownloading(false);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      simulateDownloadProgress();
      
      // Add proper headers for the request
      const response = await fetch(attachment.url, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });
      
      // Check if response is valid
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get the blob with explicit type
      const blob = await response.blob();
      
      // Make sure blob has content
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty');
      }
      
      // For PDF files, ensure correct MIME type
      if (attachment.fileType === 'application/pdf' || attachment.fileName?.endsWith('.pdf')) {
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        saveAs(pdfBlob, attachment.fileName);
      } else {
        saveAs(blob, attachment.fileName);
      }
    } catch (error) {
      console.error('Failed to download file:', error);
      setIsDownloading(false);
      // Optionally add user notification for error
    }
  };

  const handleImageClick = (e: React.MouseEvent) => {
    // Only open viewer on normal left click (not right click for context menu)
    if (e.button === 0) {
      e.preventDefault();
      e.stopPropagation();
      setImageViewerOpen(true);
    }
  };

  // Function to truncate filename based on screen size
  const truncateFilename = (name: string) => {
    // Get approximate breakpoint based on window width
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
    
    const maxLength = isMobile ? 15 : isTablet ? 25 : 40;
    
    if(!name) return '';
    
    if (name.length <= maxLength) return name;
    
    const extension = name.split('.').pop() || '';
    const nameWithoutExtension = name.substring(0, name.lastIndexOf('.'));
    
    const truncatedName = nameWithoutExtension.substring(0, maxLength - extension.length - 3) + '...';
    return `${truncatedName}.${extension}`;
  };

  // Get friendly file size
  const getFileSize = (sizeInBytes: number) => {
    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Get file icon based on type with enhanced icon selection
  const getFileIcon = () => {
    if (isImageAttachment) return <FiImage className="text-light-text-3 dark:text-light-3" size={24} />;
    if (isVideoAttachment) return <FiVideo className="text-light-text-3 dark:text-light-3" size={24} />;
    if (isAudioAttachment) return <FiMusic className="text-light-text-3 dark:text-light-3" size={24} />;
    
    // File extension based icons
    const extension = attachment.fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FiFileText className="text-red" size={24} />;
      case 'doc':
      case 'docx':
      case 'txt':
      case 'rtf':
        return <FiFileText className="text-light-text-3 dark:text-light-3" size={24} />;
      case 'xls':
      case 'xlsx':
      case 'csv':
        return <FiBarChart2 className="text-light-text-3 dark:text-light-3" size={24} />;
      case 'ppt':
      case 'pptx':
        return <FiBarChart2 className="text-light-text-3 dark:text-light-3" size={24} />;
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return <FiPackage className="text-light-text-3 dark:text-light-3" size={24} />;
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'html':
      case 'css':
      case 'py':
      case 'java':
      case 'c':
      case 'cpp':
        return <FiCode className="text-light-text-3 dark:text-light-3" size={24} />;
      case 'ics':
      case 'ical':
        return <FiCalendar className="text-light-text-3 dark:text-light-3" size={24} />;
      default:
        return <FiFile className="text-light-text-3 dark:text-light-3" size={24} />;
    }
  };

  // Get color scheme based on file type
  const getColorScheme = () => {
    const extension = attachment.fileName?.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'from-light-bg-4 dark:from-dark-4 to-light-bg-5 dark:to-dark-5 border-light-bg-4/20 dark:border-dark-4/20';
      case 'doc':
      case 'docx':
      case 'txt':
      case 'rtf':
        return 'from-light-bg-4 dark:from-dark-4 to-light-bg-5 dark:to-dark-5 border-light-bg-4/20 dark:border-dark-4/20';
      case 'xls':
      case 'xlsx':
      case 'csv':
        return 'from-light-bg-4 dark:from-dark-4 to-light-bg-5 dark:to-dark-5 border-light-bg-4/20 dark:border-dark-4/20';
      case 'ppt':
      case 'pptx':
        return 'from-light-bg-4 dark:from-dark-4 to-light-bg-5 dark:to-dark-5 border-light-bg-4/20 dark:border-dark-4/20';
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return 'from-light-bg-4 dark:from-dark-4 to-light-bg-5 dark:to-dark-5 border-light-bg-4/20 dark:border-dark-4/20';
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'html':
      case 'css':
      case 'py':
      case 'java':
      case 'c':
      case 'cpp':
        return 'from-light-bg-4 dark:from-dark-4 to-light-bg-5 dark:to-dark-5 border-light-bg-4/20 dark:border-dark-4/20';
      case 'ics':
      case 'ical':
        return 'from-light-bg-4 dark:from-dark-4 to-light-bg-5 dark:to-dark-5 border-light-bg-4/20 dark:border-dark-4/20';
      default:
        return 'from-light-bg-4 dark:from-dark-4 to-light-bg-5 dark:to-dark-5 border-light-bg-4/20 dark:border-dark-4/20';
    }
  };

  // Render meeting attachment with a separate container to break out of message constraints
  if (isMeetingAttachment && attachment.meetingData) {
    return (
      <div className={`message-attachment flex items-start w-full ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
        <MeetingAttachment
          meetingId={attachment.meetingData.meetingId}
          title={attachment.meetingData.title}
          startTime={attachment.meetingData.startTime}
          endTime={attachment.meetingData.endTime}
          status={attachment.meetingData.status}
          participantsCount={attachment.meetingData.participantsCount}
          isUserMessage={isUserMessage}
        />
      </div>
    );
  }

  // Render image attachment
  if (isImageAttachment) {
    return (
      <>
        <motion.div 
          className="message-attachment w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {!imageLoaded && (
            <div className="flex items-center justify-center h-32 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-lg animate-pulse">
              <FiImage className="text-light-3 dark:text-light-3 light:text-light-text-3" size={24} />
            </div>
          )}
          <div className="relative group">
            <img 
              src={attachment.url} 
              alt={attachment.fileName}
              className="attachment-content rounded-lg w-full max-w-full max-h-[200px] sm:max-h-[250px] md:max-h-[300px] object-contain cursor-pointer shadow-md hover:shadow-lg transition-all"
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? 'block' : 'none' }}
              onClick={handleImageClick}
            />
            {/* Overlay with file name on hover */}
            {isHovered && imageLoaded && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-1/80 dark:from-dark-1/80 light:from-light-bg-1/80 to-transparent p-2 rounded-b-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs text-light-2 dark:text-light-2 light:text-light-text-2 truncate">
                    {truncateFilename(attachment.fileName)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDownload}
                    className="ml-2 p-1 rounded-full bg-dark-3/50 dark:bg-dark-3/50 light:bg-light-bg-3/50 hover:bg-dark-3 dark:hover:bg-dark-3 light:hover:bg-light-bg-3 text-light-1 dark:text-light-1 light:text-light-text-1"
                  >
                    <FiDownload size={14} />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
        <ImageViewer
          open={imageViewerOpen}
          onOpenChange={setImageViewerOpen}
          imageUrl={attachment.url}
          imageAlt={attachment.fileName}
          fileName={attachment.fileName}
        />
      </>
    );
  }

  // Render video attachment
  if (isVideoAttachment) {
    return (
      <motion.div 
        className="message-attachment w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="rounded-lg overflow-hidden shadow-md bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4">
          <video 
            src={attachment.url}
            controls
            className="attachment-content rounded-lg w-full max-w-full max-h-[200px] sm:max-h-[250px] md:max-h-[300px] object-contain"
          />
          <div className="flex justify-between items-center px-3 py-2 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 text-light-2 dark:text-light-2 light:text-light-text-2">
            <span className="text-xs truncate">
              {truncateFilename(attachment.fileName)}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              className="p-1 rounded-full hover:bg-dark-3 dark:hover:bg-dark-3 light:hover:bg-light-bg-3 text-primary-500"
              aria-label="Download video"
            >
              <FiDownload size={14} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Render audio attachment with custom player
  if (isAudioAttachment) {
    return (
      <motion.div 
        className="message-attachment w-full"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="rounded-xl overflow-hidden shadow-md border border-light-bg-4/20 dark:border-dark-4/20 bg-gradient-to-br from-light-bg-4 dark:from-dark-4 to-light-bg-5 dark:to-dark-5">
          <div className="flex items-center p-3">
            <div className="mr-3 p-2.5 bg-light-bg-4/20 dark:bg-dark-4/20 rounded-full">
              <FiMusic className="text-light-text-3 dark:text-light-3" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-light-text-1 dark:text-light-1 truncate">
                {truncateFilename(attachment.fileName)}
              </div>
              <div className="text-xs text-light-text-3 dark:text-light-3">
                {getFileSize(attachment.size || 0)}
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              className="ml-2 p-2 rounded-full bg-light-bg-4/20 dark:bg-dark-4/20 hover:bg-light-bg-4/30 dark:hover:bg-dark-4/30 text-light-text-3 dark:text-light-3 transition-colors"
              disabled={isDownloading}
              aria-label="Download audio"
            >
              <FiDownload size={16} />
            </motion.button>
          </div>
          <audio 
            src={attachment.url}
            controls
            className="w-full px-3 pb-3 audio-controls-custom"
          />
        </div>
      </motion.div>
    );
  }

  // Render file attachment (redesigned)
  return (
    <motion.div 
      className="message-attachment w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={`relative rounded-xl overflow-hidden shadow-md border bg-gradient-to-br ${getColorScheme()}`}>
        <div className="flex p-4">
          {/* Left Section - File Icon in Circle */}
          <div 
            className={`flex items-center justify-center h-12 w-12 rounded-full bg-white bg-opacity-20 mr-4 flex-shrink-0`}
          >
            {getFileIcon()}
          </div>
          
          {/* Middle Section - File Details */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="text-sm font-medium text-light-1 dark:text-light-1 light:text-light-text-1 group-hover:text-primary-500 transition-colors truncate" title={attachment.fileName}>
              {truncateFilename(attachment.fileName)}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 text-xs text-light-3 dark:text-light-3 light:text-light-text-3 mt-1">
              <span className="whitespace-nowrap">{getFileSize(attachment.size || 0)}</span>
              <span className="whitespace-nowrap flex items-center gap-1">
                <span className="uppercase">{attachment.fileName?.split('.').pop() || 'FILE'}</span>
              </span>
            </div>
          </div>
          
          {/* Right Section - Download Button */}
          <div className="ml-2 flex items-center">
            {!isDownloading ? (
              <motion.button 
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="p-2.5 rounded-full bg-light-bg-2 dark:bg-dark-3 hover:bg-opacity-20 text-light-text-1 dark:text-light-1 transition-all"
                aria-label="Download file"
              >
                <FiDownload size={18} />
              </motion.button>
            ) : (
              <div className="relative h-10 w-10 flex items-center justify-center">
                <svg className="h-10 w-10 animate-spin" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path 
                    className="opacity-75" 
                    fill="currentColor"
                    d={`M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z`}
                  ></path>
                </svg>
                <span className="absolute text-xs font-medium">{downloadProgress}%</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Preview button for PDFs and certain filetypes */}
        {(attachment.fileName?.endsWith('.pdf') || 
          attachment.fileName?.endsWith('.doc') || 
          attachment.fileName?.endsWith('.docx')) && (
          <div className="px-4 pb-3 -mt-1">
            <button 
              className="text-sm font-medium text-primary-600 dark:text-primary-500 hover:text-primary-700 dark:hover:text-primary-600 transition-colors flex items-center"
              onClick={() => window.open(attachment.url, '_blank')}
            >
              <span>Preview file</span>
              <span className="ml-1">→</span>
            </button>
          </div>
        )}
        
        {/* Progress bar for downloading */}
        {isDownloading && (
          <div className="h-1 w-full bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3">
            <div 
              className="h-full bg-primary-500 transition-all duration-200 ease-out"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageAttachment;