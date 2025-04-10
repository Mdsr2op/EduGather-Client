import React, { useState } from 'react';
import { MessageAttachmentProps } from '../../types/messageTypes';
import { saveAs } from 'file-saver';
import MeetingAttachment from '../MeetingAttachment';

const MessageAttachment: React.FC<MessageAttachmentProps> = ({ attachment, isUserMessage }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
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

  // Render meeting attachment with a separate container to break out of message constraints
  if (isMeetingAttachment && attachment.meetingData) {
    return (
      <div className={`flex items-start ${isUserMessage ? 'justify-end w-full' : ''}`}>
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
      <div className={`${imageLoaded ? '' : 'min-h-[200px] flex items-center justify-center'}`}>
        {!imageLoaded && <div className="animate-pulse">Loading image...</div>}
        <img 
          src={attachment.url} 
          alt={attachment.fileName}
          className="rounded-lg max-w-full max-h-[300px] object-contain"
          onLoad={() => setImageLoaded(true)}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      </div>
    );
  }

  // Render video attachment
  if (isVideoAttachment) {
    return (
      <video 
        src={attachment.url}
        controls
        className="rounded-lg max-w-full max-h-[300px]"
      />
    );
  }

  // Render file attachment (default)
  return (
    <div className="flex items-center p-2 bg-dark-5 rounded-lg">
      <div className="mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </div>
      <div className="flex-1 truncate">
        <div className="text-sm font-medium truncate">{attachment.fileName}</div>
        <div className="text-xs text-gray-400">
          {(attachment.size / 1024).toFixed(1)} KB
        </div>
      </div>
      <button 
        onClick={handleDownload}
        className="ml-2 p-1 rounded-full hover:bg-dark-3"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>
    </div>
  );
};

export default MessageAttachment;