import React from 'react';

interface ImageAttachmentProps {
  url: string;
  alt?: string;
  isUserMessage: boolean;
}

const ImageAttachment: React.FC<ImageAttachmentProps> = ({ url, alt = 'Image attachment', isUserMessage }) => {
  return (
    <div className={`flex ${isUserMessage ? "justify-end" : "justify-start"} my-1`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl overflow-hidden shadow-md ${isUserMessage ? 'bg-primary-500' : 'bg-dark-4'}`}>
        <img 
          src={url} 
          alt={alt} 
          className="w-full h-auto object-cover cursor-pointer transition-transform transform hover:scale-105" 
          onClick={() => window.open(url, '_blank')} // Simple click to open in new tab
        />
      </div>
    </div>
  );
};

export default ImageAttachment; 