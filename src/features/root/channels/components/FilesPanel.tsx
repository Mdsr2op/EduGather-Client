import React, { useState } from "react";
import FileCard from "./FileCard";
import { Input } from "@/components/ui/input";
import { useGetChannelAttachmentsQuery } from "../../attachments/slices/attachmentsApiSlice";
import { useParams } from "react-router-dom";
import { Message } from "../../messages/slices/messagesApiSlice";

const FilesPanel: React.FC = () => {
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
      <div className="p-6 overflow-auto bg-dark-3">
        <h2 className="text-xl font-semibold mb-4">Files</h2>
        <p className="text-light-3">Loading files...</p>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-auto bg-dark-3">
      <h2 className="text-xl font-semibold mb-4">Files</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
        />
      </div>

      {/* Files List */}
      <div className="grid gap-4">
        {filteredFiles.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
        {filteredFiles.length === 0 && (
          <p className="text-light-3">No files found.</p>
        )}
      </div>
    </div>
  );
};

export default FilesPanel;
