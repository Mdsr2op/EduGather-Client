// FileUpload.tsx
import React, { ChangeEvent } from "react";

interface FileUploadProps {
  onFileUpload: (file: File | null) => void;
  label: string;
  accept: string;
  icon: React.ReactNode;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, label, accept, icon }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    } else {
      onFileUpload(null);
    }
  };

  return (
    <div className="file-upload">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 flex items-center">
        <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
          {icon}
        </span>
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};
