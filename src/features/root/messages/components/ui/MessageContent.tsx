import React from 'react';
import { MessageContentProps } from '../../types/messageTypes';

const MessageContent: React.FC<MessageContentProps> = ({ text }) => {
  return <p className="text-lg mb-1 xs:text-sm">{text}</p>;
};

export default MessageContent;