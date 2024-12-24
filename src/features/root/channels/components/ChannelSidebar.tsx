// ChannelSidebar.tsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Import RTK Query hooks
import {
  useGetChannelsQuery,
  useCreateChannelMutation,
  useDeleteChannelMutation,
} from "../slices/channelApiSlice";

import {
  selectSelectedChannelId,
  setSelectedChannelId,
  openChannelContextMenu,
  closeChannelContextMenu,
  selectChannelContextMenu,
} from "../slices/channelSlice";

import ChannelList from "./ChannelList";
import CreateChannelDialog from "../../chats/components/dialogs/CreateChannelDialog";
import ChannelContextMenu from "../menus/ChannelContextMenu";

interface ChannelSidebarProps {
  groupId: string;
}

const ChannelSidebar: React.FC<ChannelSidebarProps> = ({ groupId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ===================
  // Redux State
  // ===================
  const selectedChannelId = useSelector(selectSelectedChannelId) ?? "";
  const channelContextMenu = useSelector(selectChannelContextMenu);

  // ===================
  // Data Fetching
  // ===================
  const {
    data: channelData,
    isLoading,
    isError,
    error,
  } = useGetChannelsQuery(groupId, {
    skip: !groupId,
  });

  const channels = channelData?.data.channels ?? [];

  const [createChannel] = useCreateChannelMutation();
  const [deleteChannel] = useDeleteChannelMutation();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // ===================
  // Handlers
  // ===================

  // Left-click a channel to select it
  const handleSelectChannel = (channelId: string) => {
    dispatch(setSelectedChannelId(channelId));
    // Navigate to the channel view
    navigate(`/${groupId}/${channelId}`);
  };

  // Right-click a channel to open context menu
  const handleChannelContextMenu = (
    channelId: string,
    e: React.MouseEvent<HTMLLIElement>
  ) => {
    e.preventDefault();
    dispatch(
      openChannelContextMenu({
        position: { x: e.pageX, y: e.pageY },
        channelId,
      })
    );
  };

  const handleCloseContextMenu = () => {
    dispatch(closeChannelContextMenu());
  };

  const handleContextMenuAction = async (action: string, channelId: string) => {
    switch (action) {
      case "view":
        console.log(`View channel details: ${channelId}`);
        // Implement view details functionality if needed
        break;
      case "edit":
        console.log(`Edit channel: ${channelId}`);
        // Implement edit channel functionality if needed
        break;
      case "delete":
        try {
          await deleteChannel({ groupId, channelId }).unwrap();
          console.log("Channel deleted successfully");
        } catch (err) {
          console.error("Error deleting channel: ", err);
        }
        break;
      default:
        break;
    }
    // Close the context menu afterward
    handleCloseContextMenu();
  };

  const handleCreateChannelButtonClick = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateChannelConfirm = async (
    channelName: string,
    description: string
  ) => {
    try {
      await createChannel({ groupId, channelName, description }).unwrap();
      console.log("Channel created successfully!");
    } catch (err) {
      console.error("Error creating channel: ", err);
    }
  };

  // ===================
  // Conditional Renders
  // ===================
  if (isLoading) {
    return (
      <div className="bg-dark-4 text-light-2 w-64 h-full p-4 flex flex-col">
        <div>Loading channels...</div>
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching channels: ", error);
    return (
      <div className="bg-dark-4 text-light-2 w-64 h-full p-4 flex flex-col">
        <div>Error loading channels</div>
      </div>
    );
  }

  const channelInContext = channels.find(
    (c) => c._id === channelContextMenu.channelId
  );

  return (
    <div className="bg-dark-4 text-light-2 w-64 h-full p-4 flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-[1.53rem] border-b-[1px] border-dark-3 -mx-4 px-4">
        <h2 className="text-xl font-semibold text-light-1">Channels</h2>
        {/* Button to create a new channel */}
        <button
          onClick={handleCreateChannelButtonClick}
          className="bg-primary-500 hover:bg-primary-600 text-white text-xl px-2 py-1 rounded-full shadow-md"
        >
          +
        </button>
      </div>

      {/* Channel List */}
      <ChannelList
        channels={channels.map((ch) => ({
          id: ch._id,
          name: ch.channelName,
        }))}
        selectedChannelId={selectedChannelId}
        onChannelClick={handleSelectChannel}
        onChannelContextMenu={handleChannelContextMenu}
      />

      {/* Context Menu */}
      {channelContextMenu.isOpen && channelInContext && (
        <ChannelContextMenu
          channel={channelInContext}
          position={channelContextMenu.position}
          onClose={handleCloseContextMenu}
          onAction={(action) => handleContextMenuAction(action, channelInContext._id)}
        />
      )}

      {/* Create Channel Dialog */}
      {isCreateDialogOpen && (
        <CreateChannelDialog
          isOpen={isCreateDialogOpen}
          setIsOpen={setIsCreateDialogOpen}
          onConfirm={handleCreateChannelConfirm}
        />
      )}
    </div>
  );
};

export default ChannelSidebar;
