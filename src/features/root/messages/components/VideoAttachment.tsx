import React from 'react';

interface VideoAttachmentProps {
  url: string;
  isUserMessage: boolean;
}

const VideoAttachment: React.FC<VideoAttachmentProps> = ({ url, isUserMessage }) => {
  return (
    <div className={`flex ${isUserMessage ? "justify-end" : "justify-start"} my-1`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl overflow-hidden shadow-md ${isUserMessage ? 'bg-primary-500' : 'bg-dark-4'}`}>
        <video 
          src={url} 
          controls 
          className="w-full h-auto" 
        />
      </div>
    </div>
  );
};

export default VideoAttachment; 