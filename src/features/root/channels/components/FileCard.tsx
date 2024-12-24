import React from "react";
import { FiDownload } from "react-icons/fi";

interface File {
  id: number;
  name: string;
  size: string;
  date: string;
}

interface FileCardProps {
  file: File;
}

const FileCard: React.FC<FileCardProps> = ({ file }) => {
  const handleDownload = () => {
    // Implement your download logic here
    alert(`Downloading ${file.name}...`);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-dark-5 rounded hover:bg-dark-3">
      <div>
        <p className="font-medium">{file.name}</p>
        <p className="text-sm text-light-3">
          Size: {file.size} • Date: {file.date}
        </p>
      </div>
      <button
        className="flex text-primary-500 items-center space-x-1 px-3 py-2 rounded hover:bg-dark-4"
        onClick={handleDownload}
      >
        <FiDownload />
        <span className="text-sm text-primary-500">Download</span>
      </button>
    </div>
  );
};

export default FileCard;
