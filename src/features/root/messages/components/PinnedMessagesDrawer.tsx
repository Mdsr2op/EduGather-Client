import React from 'react';
import { FaThumbtack, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useGetPinnedMessagesQuery, useUnpinMessageMutation } from '../slices/messagesApiSlice';
import { useSelector } from 'react-redux';
import { selectSelectedChannelId } from '../../channels/slices/channelSlice';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { formatDistanceToNow } from 'date-fns';

interface PinnedMessagesDrawerProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  channelName: string;
}

const PinnedMessagesDrawer: React.FC<PinnedMessagesDrawerProps> = ({ 
  open, 
  onClose, 
  userId,
  channelName
}) => {
  const selectedChannelId = useSelector(selectSelectedChannelId);
  const [unpinMessage] = useUnpinMessageMutation();
  
  const { 
    data: pinnedMessages, 
    isLoading, 
    isError,
    refetch
  } = useGetPinnedMessagesQuery(
    { channelId: selectedChannelId || '' },
    { skip: !selectedChannelId || !open }
  );
  
  // Refetch when drawer opens
  React.useEffect(() => {
    if (open && selectedChannelId) {
      refetch();
    }
  }, [open, selectedChannelId, refetch]);
  
  const handleUnpinMessage = async (messageId: string) => {
    try {
      await unpinMessage({ messageId }).unwrap();
    } catch (error) {
      console.error('Failed to unpin message:', error);
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent side="right" className="w-full sm:w-96 bg-dark-2 text-light-1 p-0 border-l border-dark-4">
        <SheetHeader className="px-6 py-4 border-b border-dark-4">
          <div className="flex items-center">
            <button 
              onClick={onClose}
              className="mr-4 text-light-2 hover:text-light-1 md:hidden"
            >
              <FaArrowLeft />
            </button>
            <SheetTitle className="flex items-center text-light-1">
              <FaThumbtack className="mr-2 text-yellow-500" />
              Pinned Messages in {channelName}
            </SheetTitle>
          </div>
        </SheetHeader>
        
        <div className="overflow-y-auto h-full pb-20">
          {isLoading && (
            <div className="flex justify-center items-center h-24 text-light-2">
              Loading pinned messages...
            </div>
          )}
          
          {isError && (
            <div className="flex justify-center items-center h-24 text-red-500">
              Failed to load pinned messages
            </div>
          )}
          
          {!isLoading && !isError && pinnedMessages?.length === 0 && (
            <div className="flex flex-col justify-center items-center h-64 text-center p-6">
              <FaThumbtack className="text-4xl text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-light-1">No pinned messages</h3>
              <p className="text-light-2 mt-2">
                Important messages can be pinned for quick access
              </p>
            </div>
          )}
          
          {!isLoading && !isError && pinnedMessages && pinnedMessages.length > 0 && (
            <div className="p-2">
              {pinnedMessages.map((message) => (
                <div key={message._id} className="p-4 mb-2 border-b border-dark-4 hover:bg-dark-3 transition-colors">
                  <div className="flex justify-between">
                    <div className="flex items-center mb-2">
                      <img 
                        src={message.senderId.avatar || '/default-avatar.png'} 
                        alt={message.senderId.username}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <p className="text-light-1 font-medium">{message.senderId.username}</p>
                        <span className="text-xs text-light-3">
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    
                    {(message.senderId._id === userId || message.pinnedBy === userId) && (
                      <button 
                        onClick={() => handleUnpinMessage(message._id)}
                        className="text-light-3 hover:text-red-500 flex items-center text-sm"
                        title="Unpin message"
                      >
                        <FaTimes size={12} className="mr-1" />
                        Unpin
                      </button>
                    )}
                  </div>
                  
                  <div className="ml-10">
                    <p className="text-light-1 break-words whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Show if this is a reply */}
                    {message.replyTo && (
                      <div className="mt-2 pl-2 border-l-2 border-dark-4 text-sm text-light-3">
                        <p>Replying to: {message.replyTo.content.length > 50 
                          ? message.replyTo.content.substring(0, 50) + '...' 
                          : message.replyTo.content}
                        </p>
                      </div>
                    )}
                    
                    {/* Show if this is forwarded */}
                    {message.forwardedFrom && (
                      <div className="mt-2 text-xs text-light-3 italic">
                        Forwarded message
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PinnedMessagesDrawer; 