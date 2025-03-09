import React, { useState, useEffect } from "react";
import { useDropzone, Accept } from "react-dropzone";

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
        className={`border-2 border-dashed p-4 rounded-md ${
          isDragActive ? "border-primary-500 bg-primary-100" : "border-gray-300"
        } flex flex-col items-center justify-center w-full h-40 relative`}
      >
        {preview ? (
          <img
            src={preview}
            alt={`${label} Preview`}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <>
            {icon && <div className="mb-2">{icon}</div>}
            <p className="text-center text-gray-500 text-sm">
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