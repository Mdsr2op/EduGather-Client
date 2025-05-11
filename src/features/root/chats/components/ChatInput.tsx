// ChatInput.js
import React, { useState } from 'react';
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
import { useParams } from 'react-router-dom';

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
  const { groupId } = useParams();

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
            replyTo: replyTo
          });
          
          // Emit notification event for the new message
          socket.emit('create_notification', {
            type: 'channel_message',
            groupId,
            channelId: selectedChannelId,
            senderId: userId,
            content: message,
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
        formData.append('replyTo', replyTo.messageId);
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
        position: 'bottom-center'
      });

      if (socket) {
        socket.emit('attachment_message_created', {
          messageId: response.data.message._id,
        });
      }
      
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
    <div className="bg-dark-3 py-2 px-3 sm:px-5 flex flex-col justify-between">
      {/* Reply info */}
      {replyTo && (
        <div className="px-2 sm:px-3 py-1.5 sm:py-2 mb-1.5 sm:mb-2 text-xs sm:text-sm bg-dark-3 rounded-lg flex justify-between items-start border-l-2 border-primary-500 hover:bg-dark-2 transition-colors">
          <div className="flex flex-col w-full">
            <div className="flex items-center mb-0.5 sm:mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-primary-400">@{replyTo.senderId.username}</span>
            </div>
            <p className="text-gray-300 truncate pl-4 sm:pl-5">
              {replyTo.content?.substring(0, 80)}
              {replyTo.content?.length > 80 ? '...' : ''}
            </p>
          </div>
          <button 
            onClick={clearReply}
            className="text-gray-400 hover:text-white ml-1 sm:ml-2 flex-shrink-0"
            aria-label="Cancel Reply"
          >
            <FiX size={16} className="sm:size-18" />
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
          className={`${isLoading || isUploading ? 'text-gray-500' : 'text-primary-500 hover:text-primary-600'} flex-shrink-0 ml-1 sm:ml-2 mr-2 sm:mr-3`}
          aria-label="Send Message"
        >
          <FiSend size={20} className="sm:size-24 lg:size-10" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
