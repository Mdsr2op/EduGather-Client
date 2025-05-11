import React from "react";
import { FiDownload, FiFile, FiImage, FiFileText } from "react-icons/fi";
import { saveAs } from 'file-saver';

interface File {
  id: string;
  name: string;
  size: string;
  date: string;
  url: string;
  fileType: string;
}

interface FileCardProps {
  file: File;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      saveAs(blob, file.name);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FiFileText className="w-5 h-5 md:w-6 md:h-6" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <FiImage className="w-5 h-5 md:w-6 md:h-6" />;
      default:
        return <FiFile className="w-5 h-5 md:w-6 md:h-6" />;
    }
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
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-xl bg-dark-2 hover:bg-dark-2 transition-colors duration-200 border border-dark-4 w-full gap-3 sm:gap-0">
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <div className="text-primary-500 flex-shrink-0">
          {getFileIcon(file.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-light-1 text-sm sm:text-base truncate" title={file.name}>
            {truncateFilename(file.name, window.innerWidth < 640 ? 20 : 30)}
          </p>
          <div className="flex flex-col xs:flex-row xs:items-center text-xs sm:text-sm text-light-3 gap-1 xs:gap-2">
            <span className="whitespace-nowrap">Size: {file.size}</span>
            <span className="hidden xs:inline-block">•</span>
            <span className="whitespace-nowrap">Date: {file.date}</span>
          </div>
        </div>
      </div>
      <button
        className="flex items-center justify-center space-x-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-dark-3 hover:bg-dark-2 text-primary-500 transition-colors duration-200 w-full sm:w-auto"
        onClick={handleDownload}
      >
        <FiDownload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        <span className="text-xs sm:text-sm">Download</span>
      </button>
    </div>
  );
};

export default FileCard;