import React from 'react';
import { FaThumbtack, FaArrowLeft } from 'react-icons/fa';
import { useGetPinnedMessagesQuery, useUnpinMessageMutation } from '../slices/messagesApiSlice';
import { useSelector } from 'react-redux';
import { selectSelectedChannelId } from '../../channels/slices/channelSlice';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useSocket } from '@/lib/socket';
import { useGetChannelDetailsQuery } from '@/features/root/channels/slices/channelApiSlice';
import useMessageNavigation from '../hooks/useMessageNavigation';
import NavigationLoadingOverlay from './navigation/NavigationLoadingOverlay';
import PinnedMessagesList from './pinned/PinnedMessagesList';

interface PinnedMessagesDrawerProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  channelId: string;
  groupId: string;
}

const PinnedMessagesDrawer: React.FC<PinnedMessagesDrawerProps> = ({ 
  open, 
  onClose, 
  userId,
  channelId,
  groupId
}) => {
  const selectedChannelId = useSelector(selectSelectedChannelId);
  const [unpinMessage] = useUnpinMessageMutation();
  const { socket } = useSocket();
  const { navigateToMessage, isSearching, loadingProgress, currentAttempt } = useMessageNavigation();
  
  // Fetch channel details
  const { data: channelDetails } = useGetChannelDetailsQuery(
    { groupId, channelId },
    { skip: !groupId || !channelId || !open }
  );
  
  const channelName = channelDetails?.data?.channelName || "Channel";
  
  // Fetch pinned messages
  const { 
    data: pinnedMessages, 
    isLoading, 
    isError,
    refetch
  } = useGetPinnedMessagesQuery(
    { channelId: channelId || selectedChannelId || '' },
    { skip: (!channelId && !selectedChannelId) || !open }
  );
  
  // Refetch when drawer opens
  React.useEffect(() => {
    if (open && (channelId || selectedChannelId)) {
      refetch();
    }
  }, [open, channelId, selectedChannelId, refetch]);
  
  // Handler for unpinning messages
  const handleUnpinMessage = async (messageId: string) => {
    try {
      if (socket) {
        // Use socket to unpin message
        socket.emit('unpin_message', {
          messageId,
          userId
        });
      } else {
        // Fallback to API if socket not available
        await unpinMessage({ messageId }).unwrap();
      }
    } catch (error) {
      console.error('Failed to unpin message:', error);
    }
  };

  // Handler for navigating to messages
  const handleNavigateToMessage = (messageId: string) => {
    // Start navigation immediately - the hook will handle proper timing internally
    navigateToMessage(messageId);
    
    // Close the drawer - but do it after a very short delay to prevent UI issues
    setTimeout(() => {
      onClose();
    }, 10);
  };
  
  return (
    <>
      {/* Navigation loading overlay */}
      <NavigationLoadingOverlay 
        isVisible={isSearching} 
        progress={loadingProgress}
        currentAttempt={currentAttempt}
      />
      
      {/* Pinned messages drawer */}
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
          
          <div className="overflow-y-auto custom-scrollbar h-full pb-20">
            <PinnedMessagesList
              isLoading={isLoading}
              isError={isError}
              messages={pinnedMessages?.data}
              userId={userId}
              onUnpinMessage={handleUnpinMessage}
              onNavigateToMessage={handleNavigateToMessage}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PinnedMessagesDrawer; 