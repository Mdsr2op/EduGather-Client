import React, { useState, useEffect } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { useTheme } from "@/context/ThemeContext";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  label: string;
  accept?: Accept; // Use the Accept type from react-dropzone
  icon?: React.ReactNode;
  preview?: string | null; // Optional preview prop
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  label,
  accept,
  icon,
  preview: initialPreview = null, // default to null if not provided
}) => {
  const { theme } = useTheme();
  const [preview, setPreview] = useState<string | null>(initialPreview);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onFileUpload(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  useEffect(() => {
    // Cleanup the object URL to avoid memory leaks
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div {...getRootProps()} className="w-full">
      <input {...getInputProps()} />
      <div
        className={`border-2 border-dashed p-4 rounded-xl ${
          isDragActive 
            ? 'border-primary-500 bg-primary-100' 
            : theme === 'dark'
              ? 'border-dark-5 bg-dark-3'
              : 'border-light-bg-3 bg-light-bg-1'
        } flex flex-col items-center justify-center w-full h-40 relative`}
      >
        {preview ? (
          <img
            src={preview}
            alt={`${label} Preview`}
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <>
            {icon && <div className="mb-2">{icon}</div>}
            <p className={`text-center text-sm ${
              theme === 'dark' ? 'text-light-3' : 'text-light-text-3'
            }`}>
              {isDragActive
                ? "Drop the file here ..."
                : `Drag and drop a file here, or click to upload (${label})`}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;