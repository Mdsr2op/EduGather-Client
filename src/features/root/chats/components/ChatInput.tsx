// ChatInput.js
import React, { useState, useContext } from 'react';
import AttachButton from './AttachButton';
import { FiSend } from 'react-icons/fi';
import MessageInput from '../../messages/components/MessageInput';


const ChatInput = () => {
  const [message, setMessage] = useState('');

  const sendMessage = (message: string) => {
    console.log('Sending message:', message);
  };

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-dark-3 py-2 px-5 flex flex-col  justify-between ">
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
          className="text-primary-500 hover:text-primary-600 flex-shrink-0 ml-2 mr-3"
          aria-label="Send Message"
        >
          <FiSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
