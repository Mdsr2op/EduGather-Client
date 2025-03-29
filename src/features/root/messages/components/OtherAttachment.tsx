import React from 'react';
import { FaFileAlt, FaDownload } from 'react-icons/fa'; // Using a generic file icon

interface OtherAttachmentProps {
  url: string;
  filename: string;
  isUserMessage: boolean;
}

const OtherAttachment: React.FC<OtherAttachmentProps> = ({ url, filename, isUserMessage }) => {
  return (
    <div className={`flex ${isUserMessage ? "justify-end" : "justify-start"} my-1`}>
      <div 
        className={`flex items-center max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md cursor-pointer transition-transform transform hover:scale-105 ${isUserMessage ? 'bg-gradient-to-r from-primary-500 via-primary-600 to-blue-500 text-light-1' : 'bg-dark-4 text-light-1'}`}
        onClick={() => window.open(url, '_blank')} // Open file in new tab or trigger download
      >
        <FaFileAlt className="w-6 h-6 mr-3 flex-shrink-0" />
        <span className="flex-grow truncate mr-3 text-sm">{filename}</span>
        <a 
          href={url} 
          download={filename} // Suggest filename for download
          onClick={(e) => e.stopPropagation()} // Prevent container click when clicking download
          className="text-light-2 hover:text-light-1" 
          aria-label="Download file"
        >
          <FaDownload className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default OtherAttachment; 