import React from 'react';
import { MessageEditFormProps } from '../../types/messageTypes';
import { useTheme } from "@/context/ThemeContext";

const MessageEditForm: React.FC<MessageEditFormProps> = ({
  content,
  setContent,
  onSave,
  onCancel,
  onKeyDown
}) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={onKeyDown}
        className={`bg-transparent focus:outline-none resize-none w-full ${
          theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
        }`}
        autoFocus
      />
      <div className="flex justify-end mt-2">
        <button 
          onClick={onCancel}
          className={`text-xs mr-2 ${
            theme === 'dark' 
              ? 'text-light-2 hover:text-light-1' 
              : 'text-light-text-3 hover:text-light-text-1'
          }`}
        >
          Cancel
        </button>
        <button 
          onClick={onSave}
          className={`text-sm ${
            theme === 'dark'
              ? 'text-dark-1 hover:text-dark-2 bg-secondary-500'
              : 'text-light-text-1 hover:text-light-text-2 bg-secondary-600'
          } px-3 py-1 rounded-xl`}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MessageEditForm;