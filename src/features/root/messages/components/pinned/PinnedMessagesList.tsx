import React from 'react';
import { FaThumbtack } from 'react-icons/fa';
import PinnedMessageItem from './PinnedMessageItem';

interface PinnedMessagesListProps {
  isLoading: boolean;
  isError: boolean;
  messages?: Array<any>;
  userId: string;
  onUnpinMessage: (messageId: string) => void;
  onNavigateToMessage: (messageId: string) => void;
}


const PinnedMessagesList: React.FC<PinnedMessagesListProps> = ({
  isLoading,
  isError,
  messages = [],
  userId,
  onUnpinMessage,
  onNavigateToMessage
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24 text-light-2">
        Loading pinned messages...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-24 text-red-500">
        Failed to load pinned messages
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center p-6">
        <FaThumbtack className="text-4xl text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-light-1">No pinned messages</h3>
        <p className="text-light-2 mt-2">
          Important messages can be pinned for quick access
        </p>
      </div>
    );
  }

  return (
    <div className="p-2">
      {messages.map((message) => (
        <PinnedMessageItem
          key={message._id}
          message={message}
          userId={userId}
          onUnpin={onUnpinMessage}
          onNavigate={onNavigateToMessage}
        />
      ))}
    </div>
  );
};

export default PinnedMessagesList; 