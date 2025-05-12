import React, { useState } from 'react';
import { MessageAttachmentProps } from '../../types/messageTypes';
import { saveAs } from 'file-saver';
import MeetingAttachment from '../MeetingAttachment';
import ImageViewer from '../ImageViewer';

const MessageAttachment: React.FC<MessageAttachmentProps> = ({ attachment, isUserMessage }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  
  // Determine the type of attachment
  const isImageAttachment = attachment.fileType?.startsWith('image/');
  const isVideoAttachment = attachment.fileType?.startsWith('video/');
  const isMeetingAttachment = attachment.fileType === 'application/meeting';

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch(attachment.url);
      const blob = await response.blob();
      saveAs(blob, attachment.fileName);
    } catch (error) {
      console.error('Failed to download file:', error);
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
        <div className="message-attachment w-full">
          {!imageLoaded && <div className="animate-pulse text-xs sm:text-sm">Loading image...</div>}
          <img 
            src={attachment.url} 
            alt={attachment.fileName}
            className="attachment-content rounded-lg w-full max-w-full max-h-[200px] sm:max-h-[250px] md:max-h-[300px] object-contain cursor-pointer"
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? 'block' : 'none' }}
            onClick={handleImageClick}
          />
        </div>
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
      <div className="message-attachment w-full">
        <video 
          src={attachment.url}
          controls
          className="attachment-content rounded-lg w-full max-w-full max-h-[200px] sm:max-h-[250px] md:max-h-[300px] object-contain"
        />
      </div>
    );
  }

  // Render file attachment (default)
  return (
    <div className="message-attachment flex items-center p-2 sm:p-3 bg-dark-5 rounded-lg w-full">
      <div className="mr-1 sm:mr-2 flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </div>
      <div className="attachment-content flex-1 min-w-0 mr-1">
        <div className="text-xs sm:text-sm font-medium truncate" title={attachment.fileName}>
          {truncateFilename(attachment.fileName)}
        </div>
        <div className="text-xs text-gray-400">
          {(attachment.size / 1024).toFixed(1)} KB
        </div>
      </div>
      <button 
        onClick={handleDownload}
        className="flex-shrink-0 p-1 rounded-full hover:bg-dark-3 active:bg-dark-4 touch-manipulation"
        aria-label="Download file"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>
  );
};

export default MessageAttachment;