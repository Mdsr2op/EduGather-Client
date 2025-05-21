// src/features/recordings/components/MeetingRecordingCard.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiDownload, FiVideo, FiPlay, FiClock, FiCalendar, FiHardDrive } from "react-icons/fi";
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
  const [isHovered, setIsHovered] = useState(false);
  
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
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <div className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl border border-dark-5 dark:border-dark-5 light:border-light-bg-5 shadow-md hover:shadow-lg overflow-visible h-full flex flex-col relative group">
        {/* Top Thumbnail Section with Video Icon */}
        <div className="relative h-28 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-t-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-dark-4/90 dark:to-dark-4/90 light:to-light-bg-4/90">
            {/* Abstract visual pattern */}
            <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
              <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,50 Q25,0 50,50 T100,50" stroke="currentColor" fill="none" strokeWidth="0.5" />
                <path d="M0,25 Q25,75 50,25 T100,25" stroke="currentColor" fill="none" strokeWidth="0.5" />
                <path d="M0,75 Q25,25 50,75 T100,75" stroke="currentColor" fill="none" strokeWidth="0.5" />
              </svg>
            </div>
          </div>
          
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 rounded-full bg-primary-500/80 flex items-center justify-center cursor-pointer"
              onClick={handlePlay}
            >
              <FiPlay className="text-light-1 dark:text-light-1 light:text-white" size={20} />
            </motion.div>
          </div>
          
          {/* Recording badge */}
          <div className="absolute top-2 right-2 px-2 py-1 bg-dark-1/80 dark:bg-dark-1/80 light:bg-light-bg-1/80 text-light-2 dark:text-light-2 light:text-light-text-2 text-xs rounded-lg flex items-center gap-1">
            <FiVideo size={10} className="text-red-500" />
            <span>Recording</span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="text-md font-semibold text-light-1 dark:text-light-1 light:text-light-text-1 group-hover:text-primary-400 transition-colors mb-2" title={recording.title}>
            {truncateFilename(recording.title, 24)}
          </h3>
          
          {/* Recording metadata */}
          <div className="space-y-3 flex-grow">
            <div className="flex items-center gap-2">
              <FiCalendar className="text-primary-400" size={14} />
              <span className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3">{recording.date}</span>
            </div>
            
            {recording.duration && (
              <div className="flex items-center gap-2">
                <FiClock className="text-primary-400" size={14} />
                <span className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3">{recording.duration}</span>
              </div>
            )}
            
            {recording.size && (
              <div className="flex items-center gap-2">
                <FiHardDrive className="text-primary-400" size={14} />
                <span className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3">{recording.size}</span>
              </div>
            )}
          </div>
          
          {/* Action buttons */}
          <div className="flex mt-4 gap-2">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePlay}
              className="flex items-center justify-center flex-1 gap-1 px-3 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-light-1 dark:text-light-1 light:text-white transition-colors"
            >
              <FiPlay size={14} />
              <span className="text-xs">Play</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              className="flex items-center justify-center flex-1 gap-1 px-3 py-2 rounded-xl bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 hover:bg-dark-5 dark:hover:bg-dark-5 light:hover:bg-light-bg-5 text-primary-400 transition-colors"
            >
              <FiDownload size={14} />
              <span className="text-xs">Download</span>
            </motion.button>
          </div>
        </div>
        
        {/* Hover overlay */}
        <motion.div 
          className="absolute inset-0 bg-primary-500/5 pointer-events-none rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>
    </motion.div>
  );
};

export default MeetingRecordingCard;
