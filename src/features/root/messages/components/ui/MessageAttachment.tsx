import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageAttachmentProps } from '../../types/messageTypes';
import { saveAs } from 'file-saver';
import MeetingAttachment from '../MeetingAttachment';
import ImageViewer from '../ImageViewer';
import { FiDownload, FiFile, FiImage, FiVideo } from 'react-icons/fi';

const MessageAttachment: React.FC<MessageAttachmentProps> = ({ attachment, isUserMessage }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine the type of attachment
  const isImageAttachment = attachment.fileType?.startsWith('image/');
  const isVideoAttachment = attachment.fileType?.startsWith('video/');
  const isMeetingAttachment = attachment.fileType === 'application/meeting';

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
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
    
    if(name){
      if (name.length <= maxLength) return name;
    }

    if (name.length <= maxLength) return name;
    
    const extension = name.split('.').pop() || '';
    const nameWithoutExtension = name.substring(0, name.lastIndexOf('.'));
    
    const truncatedName = nameWithoutExtension.substring(0, maxLength - extension.length - 3) + '...';
    return `${truncatedName}.${extension}`;
  };

  // Get file icon based on type
  const getFileIcon = () => {
    if (isImageAttachment) return <FiImage className="text-blue-400" />;
    if (isVideoAttachment) return <FiVideo className="text-red-400" />;
    
    // File extension based icons
    const extension = attachment.fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FiFile className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FiFile className="text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FiFile className="text-green-500" />;
      case 'ppt':
      case 'pptx':
        return <FiFile className="text-orange-500" />;
      case 'zip':
      case 'rar':
        return <FiFile className="text-purple-500" />;
      default:
        return <FiFile className="text-gray-400" />;
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
            <div className="flex items-center justify-center h-32 bg-dark-4 rounded-lg animate-pulse">
              <FiImage className="text-light-3" size={24} />
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
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark-1/80 to-transparent p-2 rounded-b-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs text-light-2 truncate">
                    {truncateFilename(attachment.fileName)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDownload}
                    className="ml-2 p-1 rounded-full bg-dark-3/50 hover:bg-dark-3 text-light-1"
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
        <div className="rounded-lg overflow-hidden shadow-md bg-dark-4">
          <video 
            src={attachment.url}
            controls
            className="attachment-content rounded-lg w-full max-w-full max-h-[200px] sm:max-h-[250px] md:max-h-[300px] object-contain"
          />
          <div className="flex justify-between items-center px-3 py-2 bg-dark-4 text-light-2">
            <span className="text-xs truncate">
              {truncateFilename(attachment.fileName)}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDownload}
              className="p-1 rounded-full hover:bg-dark-3 text-primary-500"
              aria-label="Download video"
            >
              <FiDownload size={14} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Render file attachment (default)
  return (
    <motion.div 
      className="message-attachment w-full"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center p-3 bg-dark-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-dark-4/50">
        <div className="mr-3 p-2 bg-dark-4 rounded-lg flex-shrink-0">
          {getFileIcon()}
        </div>
        <div className="attachment-content flex-1 min-w-0 mr-3">
          <div className="text-sm font-medium text-light-1 truncate" title={attachment.fileName}>
            {truncateFilename(attachment.fileName)}
          </div>
          <div className="flex items-center gap-2 text-xs text-light-3 mt-1">
            <span>{(attachment.size / 1024).toFixed(1)} KB</span>
            <div className="w-1 h-1 rounded-full bg-light-4"></div>
            <span>{attachment.fileName.split('.').pop()?.toUpperCase() || 'FILE'}</span>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(var(--primary-500-rgb), 0.2)' }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDownload}
          className="p-2 rounded-lg bg-dark-4 hover:bg-dark-3 text-primary-500 transition-colors"
          aria-label="Download file"
        >
          <FiDownload size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default MessageAttachment;