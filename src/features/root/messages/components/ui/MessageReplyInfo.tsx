import React, { useState } from 'react';
import { MessageReplyInfoProps } from '../../types/messageTypes';
import useMessageNavigation from '../../hooks/useMessageNavigation';

const MessageReplyInfo: React.FC<MessageReplyInfoProps> = ({ replyTo }) => {
  const { navigateToMessage, isSearching } = useMessageNavigation();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleReplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsNavigating(true);
    navigateToMessage(replyTo.id);
    
    // Reset the navigating state after a timeout, in case the message is found quickly
    setTimeout(() => setIsNavigating(false), 1000);
  };

  return (
    <div 
      className="px-3 py-2 mb-1 text-sm text-light-2 dark:text-light-2 light:text-light-text-2 bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-t-lg flex items-start border-l-2 border-primary-500 hover:bg-dark-2 dark:hover:bg-dark-2 light:hover:bg-light-bg-2 transition-colors cursor-pointer"
      onClick={handleReplyClick}
      title="Click to see original message"
    >
      <div className="flex flex-col w-full">
        <div className="flex items-center mb-1">
          {isNavigating || isSearching ? (
            <svg className="animate-spin h-4 w-4 mr-1 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
          <span className="font-semibold text-primary-400">@{replyTo.senderName}</span>
        </div>
        <p className="text-light-3 dark:text-light-3 light:text-light-text-3 truncate pl-5">
          {replyTo.text.substring(0, 120)}
          {replyTo.text.length > 120 ? '...' : ''}
        </p>
      </div>
    </div>
  );
};

export default MessageReplyInfo;