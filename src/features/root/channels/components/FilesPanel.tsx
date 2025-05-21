import React, { useState } from "react";
import FileCard from "./FileCard";
import { Input } from "@/components/ui/input";
import { useGetChannelAttachmentsQuery } from "../../attachments/slices/attachmentsApiSlice";
import { useParams } from "react-router-dom";
import { Message } from "../../messages/slices/messagesApiSlice";
import { FiX } from "react-icons/fi";

interface FilesPanelProps {
  onClose?: () => void;
}

const FilesPanel: React.FC<FilesPanelProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { channelId } = useParams();
  const { data: attachmentsData, isLoading } = useGetChannelAttachmentsQuery(
    { channelId: channelId || "" },
    { skip: !channelId }
  );

  const attachments = attachmentsData?.data.messages
    .filter((message): message is Message & { attachment: NonNullable<Message['attachment']> } => 
      message.attachment !== null && message.attachment !== undefined
    )
    .map(message => ({
      id: message.attachment._id,
      name: message.attachment.fileName,
      size: `${Math.round(message.attachment.size / 1024)} KB`,
      date: new Date(message.createdAt).toLocaleDateString(),
      url: message.attachment.url,
      fileType: message.attachment.fileType
    })) || [];

  const filteredFiles = attachments.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="p-6 overflow-auto bg-dark-3 dark:bg-dark-3 bg-light-bg-2 light:bg-light-bg-2 relative">
        {onClose && (
          <button
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-dark-4 dark:hover:bg-dark-4 hover:bg-light-bg-3 light:hover:bg-light-bg-3 text-light-3 dark:text-light-3 text-light-text-4 light:text-light-text-4"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        )}
        <h2 className="text-xl font-semibold mb-4 text-light-1 dark:text-light-1 text-light-text-1 light:text-light-text-1">Files</h2>
        <p className="text-light-3 dark:text-light-3 text-light-text-4 light:text-light-text-4">Loading files...</p>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-auto bg-dark-3 dark:bg-dark-3 bg-light-bg-2 light:bg-light-bg-2 relative rounded-2xl">
     

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-1 block w-full bg-light-bg-1 dark:bg-dark-3 border border-light-bg-4 dark:border-dark-5 text-light-text-1 dark:text-light-1 placeholder-light-text-4 dark:placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
        />
      </div>

      {/* Files List */}
      <div className="grid gap-4">
        {filteredFiles.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
        {filteredFiles.length === 0 && (
          <p className="text-light-3 dark:text-light-3 text-light-text-4 light:text-light-text-4">No files found.</p>
        )}
      </div>
    </div>
  );
};

export default FilesPanel;
