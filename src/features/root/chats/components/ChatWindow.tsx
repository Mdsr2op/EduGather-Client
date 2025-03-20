// ChatWindow.js
import React from 'react';
import MessageBody from './MessageBody';
import ChatInput from './ChatInput';
import { useSelector } from 'react-redux';
import { selectSelectedChannelId } from '../../channels/slices/channelSlice';
import { useGetMessagesQuery } from '../../messages/slices/messagesApiSlice';

interface ChatWindowProps {
  userId: string;
}

const ChatWindow = ({ userId }: ChatWindowProps) => {
  const selectedChannelId = useSelector(selectSelectedChannelId);
  
  const {
    data: messagesData,
    isLoading,
    isError
  } = useGetMessagesQuery({ 
    channelId: selectedChannelId || ''
  }, {
    skip: !selectedChannelId,
    pollingInterval: 5000 // Poll for new messages every 5 seconds
  });

  // Format messages for UI
  const messages = messagesData?.messages?.map(msg => ({
    id: msg._id,
    text: msg.content,
    senderId: msg.senderId._id,
    senderName: msg.senderId.username,
    timestamp: new Date(msg.createdAt).getTime()
  })) || [];

  if (isLoading) {
    return <div className="flex flex-col h-full justify-center items-center">Loading messages...</div>;
  }

  if (isError) {
    return <div className="flex flex-col h-full justify-center items-center text-red-500">Failed to load messages</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <MessageBody messages={messages} userId={userId} />
      <ChatInput userId={userId} />
    </div>
  );
};

export default ChatWindow;
