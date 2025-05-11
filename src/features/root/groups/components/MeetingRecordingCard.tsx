// src/features/recordings/components/MeetingRecordingCard.tsx
import React from "react";
import { FiDownload, FiVideo, FiPlay } from "react-icons/fi";
import { saveAs } from 'file-saver';

interface Recording {
  id: number;
  title: string;
  date: string;
  fileName: string;
  url: string;
  duration?: string;
  size?: string;
}

interface MeetingRecordingCardProps {
  recording: Recording;
}

const MeetingRecordingCard: React.FC<MeetingRecordingCardProps> = ({ recording }) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch(recording.url);
      const blob = await response.blob();
      saveAs(blob, recording.fileName);
    } catch (error) {
      console.error("Failed to download recording:", error);
      alert("Failed to download the recording.");
    }
  };

  const handlePlay = () => {
    window.open(recording.url, '_blank');
  };

  // Function to truncate filename if too long
  const truncateFilename = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    
    const extension = name.split('.').pop() || '';
    const nameWithoutExtension = name.substring(0, name.lastIndexOf('.'));
    
    const truncatedName = nameWithoutExtension.substring(0, maxLength - extension.length - 3) + '...';
    return `${truncatedName}.${extension}`;
  };

  return (
    <div className="flex flex-col bg-dark-3 rounded-xl shadow-md p-4 hover:bg-dark-4 transition-colors border border-dark-4">
      <div className="flex items-center mb-3">
        <div className="text-primary-500 mr-3">
          <FiVideo className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <h3 className="text-md md:text-lg font-semibold text-light-1 truncate" title={recording.title}>
          {truncateFilename(recording.title, window.innerWidth < 640 ? 20 : 30)}
        </h3>
      </div>
      
      <div className="flex flex-col text-xs md:text-sm text-light-3 mb-4 gap-1">
        <div className="flex justify-between">
          <span>Recorded:</span>
          <span>{recording.date}</span>
        </div>
        {recording.duration && (
          <div className="flex justify-between">
            <span>Duration:</span>
            <span>{recording.duration}</span>
          </div>
        )}
        {recording.size && (
          <div className="flex justify-between">
            <span>Size:</span>
            <span>{recording.size}</span>
          </div>
        )}
      </div>
      
      <div className="flex mt-auto gap-2">
        <button
          onClick={handlePlay}
          className="flex items-center justify-center flex-1 space-x-1 px-3 py-1.5 rounded-md bg-primary-500 hover:bg-primary-600 text-light-1 transition-colors duration-200"
        >
          <FiPlay className="w-3.5 h-3.5" />
          <span className="text-xs">Play</span>
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center justify-center flex-1 space-x-1 px-3 py-1.5 rounded-md bg-dark-4 hover:bg-dark-5 text-primary-500 transition-colors duration-200"
        >
          <FiDownload className="w-3.5 h-3.5" />
          <span className="text-xs">Download</span>
        </button>
      </div>
    </div>
  );
};

export default MeetingRecordingCard;
