// ChatInput.js
import React, { useState, useEffect } from 'react';
import AttachButton from './AttachButton';
import { FiSend, FiX } from 'react-icons/fi';
import MessageInput from '../../messages/components/MessageInput';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedChannelId } from '../../channels/slices/channelSlice';
import { RootState } from '@/redux/store/store';
import { setReplyTo } from '../../messages/slices/messagesSlice';
import { useSocket } from '@/lib/socket';
import { useUploadAttachmentMutation } from '../../attachments/slices/attachmentsApiSlice';
import { toast } from 'react-hot-toast';

interface ChatInputProps {
  userId: string;
}

const ChatInput = ({ userId }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const selectedChannelId = useSelector(selectSelectedChannelId);
  const replyTo = useSelector((state: RootState) => state.messages.replyTo);
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const [uploadAttachment, { isLoading: isUploading }] = useUploadAttachmentMutation();

  const handleSend = async () => {
    if (message.trim() && selectedChannelId) {
      try {
        setIsLoading(true);
        
        if (socket) {
          // The server expects 'new_message' event
          socket.emit('new_message', {
            senderId: userId,
            content: message,
            mentions: [],
            // Include reply reference if replying to a message
            replyTo: replyTo ? replyTo._id : null
          });
          
          // Clear the reply state
          if (replyTo) {
            dispatch(setReplyTo(null));
          }
        } else {
          console.error('Socket not connected');
        }
        
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
        toast.error('Failed to send message');
      } finally {
        setIsLoading(false);
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

  const handleFileSelect = async (file: File, caption?: string) => {
    if (!selectedChannelId) {
      console.error('Cannot send file: Channel not selected');
      toast.error('Channel not selected');
      return;
    }
    
    try {
      // Create a FormData object to upload the file
      const formData = new FormData();
      formData.append('files', file); // Note: Backend expects 'files' not 'file'
      
      // Add caption as content if provided
      if (caption) {
        formData.append('content', caption);
      }
      
      // Add reply reference if available
      if (replyTo) {
        formData.append('replyTo', replyTo._id);
      }
      
      // Show uploading toast at the bottom center
      toast.loading('Uploading file...', { 
        id: 'uploading',
        position: 'bottom-center',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        }
      });
      
      // Use the uploaded attachment mutation
      const response = await uploadAttachment({
        channelId: selectedChannelId,
        formData
      }).unwrap();
      
      // Show success toast at the bottom center
      toast.success('File uploaded successfully', { 
        id: 'uploading',
        position: 'bottom-center',
        style: {
          borderRadius: '10px',

        }
      });
      
      console.log('Attachment uploaded successfully:', response);
      
      // Clear the reply state if necessary
      if (replyTo) {
        dispatch(setReplyTo(null));
      }
      
    } catch (error) {
      console.error('Failed to upload file:', error);
      toast.error('Failed to upload file', { 
        id: 'uploading',
        position: 'bottom-center',
        style: {
          borderRadius: '10px',
          background: '#EF4444',
          color: '#fff',
        }
      });
    }
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
        <AttachButton onFileSelect={handleFileSelect} isUploading={isUploading} />
        <MessageInput
          message={message}
          setMessage={setMessage}
          onEmojiSelect={(emoji: string) => setMessage((prev) => prev + emoji)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || isUploading || !message.trim()}
          className={`${isLoading || isUploading ? 'text-gray-500' : 'text-primary-500 hover:text-primary-600'} flex-shrink-0 ml-2 mr-3`}
          aria-label="Send Message"
        >
          <FiSend size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
