import React from 'react';
import { MessageContentProps } from '../../types/messageTypes';

const MessageContent: React.FC<MessageContentProps> = ({ text }) => {
  return <p className="text-base sm:text-base md:text-lg mb-1 xs:text-xs">{text}</p>;
};

export default MessageContent;