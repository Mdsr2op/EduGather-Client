import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

interface PinnedMessageItemProps {
  message: {
    _id: string;
    content: string;
    createdAt: string;
    senderId: {
      _id: string;
      username: string;
      avatar?: string;
    };
    pinnedBy?: {
      _id: string;
    };
    forwardedFrom?: any;
  };
  userId: string;
  onUnpin: (messageId: string) => void;
  onNavigate: (messageId: string) => void;
}

/**
 * Component for rendering a single pinned message in the drawer
 */
const PinnedMessageItem: React.FC<PinnedMessageItemProps> = ({
  message,
  userId,
  onUnpin,
  onNavigate
}) => {
  const handleUnpin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUnpin(message._id);
  };

  const handleClick = () => {
    onNavigate(message._id);
  };

  // Check if current user can unpin this message
  const canUnpin = message.senderId._id === userId || message.pinnedBy?._id === userId;
  
  return (
    <div 
      className="p-4 mb-2 border-b border-dark-4 dark:border-dark-4 hover:bg-dark-3 dark:hover:bg-dark-3 hover:bg-light-bg-3 light:hover:bg-light-bg-3 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between">
        <div className="flex items-center mb-2">
          <img 
            src={message.senderId.avatar || '/default-avatar.png'} 
            alt={message.senderId.username}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-light-1 dark:text-light-1 light:text-light-text-1 font-medium">{message.senderId.username}</p>
            <span className="text-xs text-light-3 dark:text-light-3 light:text-light-text-4">
              {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
        
        {canUnpin && (
          <button 
            onClick={handleUnpin}
            className="text-light-3 dark:text-light-3 light:text-light-text-4 hover:text-red-500 flex items-center text-sm"
            title="Unpin message"
          >
            <FaTimes size={12} className="mr-1" />
            Unpin
          </button>
        )}
      </div>
      
      <div className="ml-10">
        <p className="text-light-1 dark:text-light-1 light:text-light-text-1 break-words whitespace-pre-wrap">{message.content}</p>
        
        {/* Show if this is forwarded */}
        {message.forwardedFrom && (
          <div className="mt-2 text-xs text-light-3 dark:text-light-3 light:text-light-text-4 italic">
            Forwarded message
          </div>
        )}
      </div>
    </div>
  );
};

export default PinnedMessageItem; 