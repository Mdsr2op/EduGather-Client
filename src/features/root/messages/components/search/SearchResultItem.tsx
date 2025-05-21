import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { SearchResultMessage } from '../../pages/SearchResultsPage';
import { useTheme } from "@/context/ThemeContext";

interface SearchResultItemProps {
  message: SearchResultMessage;
  onNavigate: (messageId: string, groupId: string, channelId: string) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ message, onNavigate }) => {
  const { theme } = useTheme();

  const handleClick = () => {
    onNavigate(message._id, message.groupId, message.channelId);
  };

  return (
    <div 
      className={`p-4 rounded-lg transition-colors cursor-pointer ${
        theme === 'dark'
          ? 'bg-dark-3 hover:bg-dark-4'
          : 'bg-light-bg-1 hover:bg-light-bg-2'
      }`}
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
            <p className={theme === 'dark' ? 'text-light-1' : 'text-light-text-1'}>
              {message.senderId.username}
            </p>
            <div className={`flex items-center text-xs ${
              theme === 'dark' ? 'text-light-3' : 'text-light-text-3'
            }`}>
              <span>{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
              <span className="mx-1">•</span>
              <span>{message.groupName} / #{message.channelName}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="ml-10">
        <p className={`break-words whitespace-pre-wrap ${
          theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
        }`}>
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default SearchResultItem; 