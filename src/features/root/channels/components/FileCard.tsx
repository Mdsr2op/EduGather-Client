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
        return <FiFileText className="w-6 h-6" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <FiImage className="w-6 h-6" />;
      default:
        return <FiFile className="w-6 h-6" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-dark-2 hover:bg-dark-2 transition-colors duration-200 border border-dark-4">
      <div className="flex items-center space-x-4">
        <div className="text-primary-500">
          {getFileIcon(file.name)}
        </div>
        <div>
          <p className="font-medium text-light-1">{file.name}</p>
          <p className="text-sm text-light-3">
            Size: {file.size} • Date: {file.date}
          </p>
        </div>
      </div>
      <button
        className="flex items-center space-x-2 px-4 py-2 rounded-md bg-dark-3 hover:bg-dark-2 text-primary-500 transition-colors duration-200"
        onClick={handleDownload}
      >
        <FiDownload className="w-4 h-4" />
        <span className="text-sm">Download</span>
      </button>
    </div>
  );
};

export default FileCard;
