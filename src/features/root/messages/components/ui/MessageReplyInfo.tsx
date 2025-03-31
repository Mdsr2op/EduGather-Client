import React from 'react';
import { MessageReplyInfoProps } from '../../types/messageTypes';

const MessageReplyInfo: React.FC<MessageReplyInfoProps> = ({ replyTo }) => {
  return (
    <div className="px-3 py-1 mb-1 text-xs text-gray-400 bg-dark-5 rounded-t-lg flex items-center">
      <span className="mr-1">Reply to</span>
      <span className="font-semibold">{replyTo.senderName}</span>: 
      <span className="ml-1 truncate">
        {replyTo.text.substring(0, 50)}
        {replyTo.text.length > 50 ? '...' : ''}
      </span>
    </div>
  );
};

export default MessageReplyInfo;