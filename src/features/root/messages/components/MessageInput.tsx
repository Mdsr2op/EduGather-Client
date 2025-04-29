import React, { useRef, useEffect } from 'react';
import EmojiPicker from './EmojiPicker';
interface MessageInputProps {
    message: string;
    setMessage: (message: string) => void;
    onEmojiSelect: (emoji: string) => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
}

const MessageInput = ({ message, setMessage, onEmojiSelect, onKeyPress }: MessageInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MAX_HEIGHT = 80; // Maximum height in pixels
  
  // Auto resize the textarea based on content with a maximum height
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get accurate scrollHeight
      textareaRef.current.style.height = 'auto';
      
      // Calculate the new height
      const scrollHeight = textareaRef.current.scrollHeight;
      
      // Apply the height, but cap it at MAX_HEIGHT
      textareaRef.current.style.height = 
        scrollHeight <= MAX_HEIGHT 
          ? `${scrollHeight}px` 
          : `${MAX_HEIGHT}px`;
      
      // Enable scrolling if content exceeds max height
      textareaRef.current.style.overflowY = 
        scrollHeight > MAX_HEIGHT ? 'auto' : 'hidden';
    }
  }, [message]);

  return (
    <div className="flex-grow flex items-center bg-dark-2 rounded-full px-4 py-2 mr-2">
      <textarea
        ref={textareaRef}
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={onKeyPress}
        rows={1}
        className="flex-grow bg-transparent text-light-1 placeholder-light-3 focus:outline-none resize-none max-h-[120px]"
      />
      <div className="mt-1">
        <EmojiPicker onSelectEmoji={onEmojiSelect} />
      </div>
    </div>
  );
};

export default MessageInput;
