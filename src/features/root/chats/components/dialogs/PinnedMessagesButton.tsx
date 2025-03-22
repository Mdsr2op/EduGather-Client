import React, { useState } from "react";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { useSelector } from "react-redux";
import { selectSelectedChannelId } from "../../../channels/slices/channelSlice";
import { useGetPinnedMessagesQuery } from "../../../messages/slices/messagesApiSlice";
import PinnedMessagesDrawer from "../../../messages/components/PinnedMessagesDrawer";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";

const PinnedMessagesButton = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const selectedChannelId = useSelector(selectSelectedChannelId);
  const user = useAppSelector(selectCurrentUser);
  
  // Get channel details to pass to the drawer
  const channelName = useSelector((state: any) => {
    if (!selectedChannelId) return "Channel";
    // Check if channels exists in the state
    const channels = state.channel?.channels || [];
    if (channels.length === 0) return "Channel";
    
    const selectedChannel = channels.find((ch: any) => ch._id === selectedChannelId);
    return selectedChannel?.channelName || "Channel";
  });
  
  // Use the API to get the pinned messages count
  const { data: pinnedMessages } = useGetPinnedMessagesQuery(
    { channelId: selectedChannelId || '' },
    { skip: !selectedChannelId }
  );
  
  const pinnedMessagesCount = pinnedMessages?.length || 0;
  
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
          className="relative hover:text-light-1"
          onClick={handleOpenDrawer}
          title="Pinned Messages"
        >
          <PushPinOutlinedIcon className={`text-light-3 ${pinnedMessagesCount > 0 ? 'text-yellow-500' : ''}`} />
          {pinnedMessagesCount > 0 && (
            <span className="absolute -top-2 -right-2 mr-5 bg-secondary-500 text-black font-bold text-base rounded-full w-5 h-5 flex items-center justify-center">
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
        channelName={channelName}
      />
    </>
  );
};

export default PinnedMessagesButton;
