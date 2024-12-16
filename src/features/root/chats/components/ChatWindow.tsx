// ChatWindow.js
import React from 'react';
import MessageBody from './MessageBody';
import { MessageType } from '../../messages/components/Message';
import ChatInput from './ChatInput';

interface ChatWindowProps {
    initialMessages: MessageType[];
    userId: string;
}

const ChatWindow = ({ initialMessages, userId }: ChatWindowProps) => {
  return (
      <div className="flex flex-col h-full">
        <MessageBody messages={initialMessages} userId={userId} />
        <ChatInput />
      </div>
  );
};

export default ChatWindow;
