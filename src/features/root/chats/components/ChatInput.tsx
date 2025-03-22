// ChatInput.js
import React, { useState, useEffect } from 'react';
import AttachButton from './AttachButton';
import { FiSend, FiX } from 'react-icons/fi';
import MessageInput from '../../messages/components/MessageInput';
import { 
  useSendMessageMutation,
  useReplyMessageMutation
} from '../../messages/slices/messagesApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedChannelId } from '../../channels/slices/channelSlice';
import { RootState } from '@/redux/store/store';
import { setReplyTo } from '../../messages/slices/messagesSlice';

interface ChatInputProps {
  userId: string;
}

const ChatInput = ({ userId }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const [replyMessage, { isLoading: isReplying }] = useReplyMessageMutation();
  const selectedChannelId = useSelector(selectSelectedChannelId);
  const replyTo = useSelector((state: RootState) => state.messages.replyTo);
  const dispatch = useDispatch();
  
  const isLoading = isSending || isReplying;

  const handleSend = async () => {
    if (message.trim() && selectedChannelId) {
      try {
        if (replyTo) {
          // Send as a reply
          await replyMessage({
            messageId: replyTo._id,
            data: {
              content: message,
              mentions: [] // Add logic for mentions if needed
            }
          }).unwrap();
          
          // Clear the reply state
          dispatch(setReplyTo(null));
        } else {
          // Send as a regular message
          await sendMessage({
            channelId: selectedChannelId,
            senderId: userId,
            content: message
          }).unwrap();
        }
        
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
  
  const clearReply = () => {
    dispatch(setReplyTo(null));
  };

  return (
    <div className="bg-dark-3 py-2 px-5 flex flex-col justify-between">
      {/* Reply info */}
      {replyTo && (
        <div className="mb-2 p-2 bg-dark-4 rounded-md flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Replying to {replyTo.senderId.username}</span>
            <span className="text-sm text-white truncate">{replyTo.content}</span>
          </div>
          <button 
            onClick={clearReply}
            className="text-gray-400 hover:text-white"
            aria-label="Cancel Reply"
          >
            <FiX size={18} />
          </button>
        </div>
      )}
      
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
