import ChannelSidebar from '@/features/root/channels/components/ChannelSidebar';
import ChatHeader from '@/features/root/chats/components/ChatHeader';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Channel {
    id: string;
    name: string;
  }

function ChatPage() {
  const [channels] = useState<Channel[]>([
    { id: "1", name: "General" },
    { id: "2", name: "Random" },
  ]);
  const [selectedChannel, setSelectedChannel] = useState(channels[0].name);
  const [messages, setMessages] = useState([
    {
      id: 1,
      senderId: 1,
      senderName: 'User1',
      text: 'Hello everyone!',
      timestamp: Date.now() - 60000,
    },
    {
      id: 2,
      senderId: 2,
      senderName: 'User2',
      text: 'Hi!',
      timestamp: Date.now() - 30000,
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'User1',
      text: '',
      timestamp: Date.now() - 20000,
      resource: {
        type: 'image/jpeg',
        url: 'https://picsum.photos/200/300',
        name: 'sample-image.jpg',
      },
    },
    {
      id: 4,
      senderId: 2,
      senderName: 'User2',
      text: 'Here’s a file you might need.',
      timestamp: Date.now() - 10000,
      resource: {
        type: 'file',
        url: 'https://example.com/sample.pdf',
        name: 'sample-file.pdf',
      },
    },
  ]);
  
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const userId = 1; // Assuming current user has ID 1
  const navigate = useNavigate(); // Use navigate for route navigation


  const handleSelectChannel = (channelName: string) => {
    setSelectedChannel(channelName);
  };

  return (
    <div className="flex h-[100dvh] max-h-[100dvh] overflow-y-auto overflow-x-hidden custom-scrollbar bg-dark-3 text-white ">
      <ChannelSidebar
        channels={channels}
        selectedChannel={selectedChannel}
        onSelectChannel={handleSelectChannel}
      />
      <div className="flex flex-col flex-grow p-4 bg-dark-4 rounded-xl">
        <ChatHeader channelName={selectedChannel} membersCount={2} />
      </div>

    </div>
  );
}

export default ChatPage;
