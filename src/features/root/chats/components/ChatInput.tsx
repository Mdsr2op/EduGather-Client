// ChatInput.js
import React, { useState } from 'react';
import AttachButton from './AttachButton';
import { FiSend } from 'react-icons/fi';
import MessageInput from '../../messages/components/MessageInput';
import { useSendMessageMutation } from '../../messages/slices/messagesApiSlice';
import { useSelector } from 'react-redux';
import { selectSelectedChannelId } from '../../channels/slices/channelSlice';

interface ChatInputProps {
  userId: string;
}

const ChatInput = ({ userId }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const selectedChannelId = useSelector(selectSelectedChannelId);

  const handleSend = async () => {
    if (message.trim() && selectedChannelId) {
      try {
        await sendMessage({
          channelId: selectedChannelId,
          senderId: userId,
          content: message
        }).unwrap();
        
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-dark-3 py-2 px-5 flex flex-col justify-between">
      <div className="flex items-center rounded-lg">
        <AttachButton onFileSelect={(file: File) => console.log('File selected:', file)} />
        <MessageInput
          message={message}
          setMessage={setMessage}
          onEmojiSelect={(emoji: string) => setMessage((prev) => prev + emoji)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !message.trim()}
          className={`${isLoading ? 'text-gray-500' : 'text-primary-500 hover:text-primary-600'} flex-shrink-0 ml-2 mr-3`}
          aria-label="Send Message"
        >
          <FiSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
