import React from 'react';
import EmojiPicker from './EmojiPicker';
interface MessageInputProps {
    message: string;
    setMessage: (message: string) => void;
    onEmojiSelect: (emoji: string) => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
}

const MessageInput = ({ message, setMessage, onEmojiSelect, onKeyPress }: MessageInputProps) => {
  return (
    <div className="flex-grow flex items-center bg-dark-2 rounded-full px-4 py-2 mr-2">
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={onKeyPress}
        className="flex-grow bg-transparent text-light1 placeholder-light-3 focus:outline-none"
      />
      <div className="mt-1">
        <EmojiPicker onSelectEmoji={onEmojiSelect} />
      </div>
    </div>
  );
};

export default MessageInput;
