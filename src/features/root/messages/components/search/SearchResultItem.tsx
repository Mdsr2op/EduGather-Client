import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '../../slices/messagesApiSlice';
import { SearchResultMessage } from '../../pages/SearchResultsPage';

interface SearchResultItemProps {
  message: SearchResultMessage;
  onNavigate: (messageId: string, groupId: string, channelId: string) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ message, onNavigate }) => {
  const handleClick = () => {
    onNavigate(message._id, message.groupId, message.channelId);
  };

  return (
    <div 
      className="p-4 bg-dark-3 rounded-lg hover:bg-dark-4 transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          <img 
            src={message.senderId.avatar || '/default-avatar.png'} 
            alt={message.senderId.username}
            className="w-8 h-8 rounded-full mr-2"
          />
          <div>
            <p className="text-light-1 font-medium">{message.senderId.username}</p>
            <div className="flex items-center text-xs text-light-3">
              <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
              <span className="mx-1">•</span>
              <span>{message.groupName} / #{message.channelName}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="ml-10">
        <p className="text-light-1 break-words whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default SearchResultItem; 