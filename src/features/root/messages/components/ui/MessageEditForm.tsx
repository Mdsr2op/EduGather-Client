import React from 'react';
import { MessageEditFormProps } from '../../types/messageTypes';

const MessageEditForm: React.FC<MessageEditFormProps> = ({
  content,
  setContent,
  onSave,
  onCancel,
  onKeyDown
}) => {
  return (
    <div className="flex flex-col">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={onKeyDown}
        className="bg-transparent text-light-1 focus:outline-none resize-none w-full"
        autoFocus
      />
      <div className="flex justify-end mt-2">
        <button 
          onClick={onCancel}
          className="text-xs mr-2 text-light-2 hover:text-light-1"
        >
          Cancel
        </button>
        <button 
          onClick={onSave}
          className="text-xs text-primary-500 hover:text-primary-400"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MessageEditForm;