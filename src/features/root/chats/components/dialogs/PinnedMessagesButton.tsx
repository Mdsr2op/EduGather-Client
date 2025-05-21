import { useState, useEffect } from "react";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { selectSelectedChannelId } from "../../../channels/slices/channelSlice";
import { useGetPinnedMessagesQuery } from "../../../messages/slices/messagesApiSlice";
import PinnedMessagesDrawer from "../../../messages/components/PinnedMessagesDrawer";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";
import { selectSelectedGroupId } from "@/features/root/groups/slices/groupSlice";
import { useSocket } from "@/lib/socket";

const PinnedMessagesButton = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const selectedChannelId = useAppSelector(selectSelectedChannelId);
  const selectedGroupId = useAppSelector(selectSelectedGroupId);
  const user = useAppSelector(selectCurrentUser);
  const { socket } = useSocket();
  
  // Use the API to get the pinned messages count
  const { data: pinnedMessages, refetch } = useGetPinnedMessagesQuery(
    { channelId: selectedChannelId || '' },
    { skip: !selectedChannelId }
  );
  const pinnedMessagesCount = pinnedMessages?.data?.length || 0;
  
  // Set up socket listeners for real-time pinned message updates
  useEffect(() => {
    if (!socket || !selectedChannelId) return;
    
    // Listen for message pin events
    const handleMessagePinned = () => {
      refetch();
    };
    
    // Listen for message unpin events
    const handleMessageUnpinned = () => {
      refetch();
    };
    
    // Add event listeners
    socket.on("message_pinned", handleMessagePinned);
    socket.on("message_unpinned", handleMessageUnpinned);
    
    // Clean up listeners on unmount or when channel changes
    return () => {
      socket.off("message_pinned", handleMessagePinned);
      socket.off("message_unpinned", handleMessageUnpinned);
    };
  }, [socket, selectedChannelId, refetch]);
  
  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };
  
  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };
  
  return (
    <>
      <div className="relative group">
        <button 
          className={`relative p-2 rounded-full transition-all duration-200 ${
            isDrawerOpen 
              ? 'bg-primary-500/20 text-primary-500' 
              : 'hover:bg-light-bg-2 dark:hover:bg-dark-4'
          }`}
          onClick={handleOpenDrawer}
          title="Pinned Messages"
        >
          <PushPinOutlinedIcon className={`
            ${pinnedMessagesCount > 0 ? 'text-yellow-500' : 'text-light-3'} 
            transform -rotate-45 group-hover:rotate-0 transition-transform duration-200
          `} />
          {pinnedMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-secondary-500 text-dark-1 font-bold text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              {pinnedMessagesCount}
            </span>
          )}
        </button>
      </div>
      
      {/* Pinned Messages Drawer */}
      <PinnedMessagesDrawer 
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        userId={user?._id || ''}
        channelId={selectedChannelId || ''}
        groupId={selectedGroupId || ''}
      />
    </>
  );
};

export default PinnedMessagesButton;
