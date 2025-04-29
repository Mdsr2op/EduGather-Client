// EmojiPicker.jsx
import { useState, useRef, useEffect } from 'react';
import { FiSmile } from 'react-icons/fi';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

const EmojiPicker = ({ onSelectEmoji }: EmojiPickerProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleEmojiSelect = (emoji: any) => {
    onSelectEmoji(emoji.native);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  return (
    <div className="relative">
      <button
        className="text-light-3 hover:text-light-1 focus:outline-none"
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        aria-label="Toggle Emoji Picker"
      >
        <FiSmile size={24} />
      </button>

      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 right-0 z-50" ref={pickerRef}>
          <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="dark" />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
