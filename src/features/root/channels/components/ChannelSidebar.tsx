// ChannelSidebar.tsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Import RTK Query hooks
import {
  useGetChannelsQuery,
  useCreateChannelMutation,
} from "../slices/channelApiSlice";

import {
  selectSelectedChannelId,
  setSelectedChannelId,
  openChannelContextMenu,
  closeChannelContextMenu,
  selectChannelContextMenu,
  openViewChannelDetailsDialog,
  closeViewChannelDetailsDialog,
  openEditChannelDialog,
  closeEditChannelDialog,
  openDeleteChannelDialog,
  closeDeleteChannelDialog,
  selectIsViewChannelDetailsOpen,
  selectViewChannelDetailsData,
  selectIsEditChannelDialogOpen,
  selectEditChannelData,
  selectIsDeleteChannelDialogOpen,
  selectDeleteChannelData,
} from "../slices/channelSlice";

import ChannelList from "./ChannelList";
import CreateChannelDialog from "../../chats/components/dialogs/CreateChannelDialog";
import ChannelContextMenu from "../menus/ChannelContextMenu";
import EditChannelDialog from "../dialogs/EditChannelDialog";
import ViewChannelDetails from "../dialogs/ViewChannelDetails";
import DeleteChannelDialog from "../dialogs/DeleteChannelDialog";

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

  // For the new dialogs:
  const isViewChannelDetailsOpen = useSelector(selectIsViewChannelDetailsOpen);
  const viewChannelDetailsData = useSelector(selectViewChannelDetailsData);

  const isEditChannelDialogOpen = useSelector(selectIsEditChannelDialogOpen);
  const editChannelData = useSelector(selectEditChannelData);

  const isDeleteChannelDialogOpen = useSelector(selectIsDeleteChannelDialogOpen);
  const deleteChannelData = useSelector(selectDeleteChannelData);

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

  // Create channel
  const [createChannel] = useCreateChannelMutation();

  // For local state controlling the "Create Channel" button
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // ===================
  // Handlers
  // ===================

  // Left-click a channel to select it
  const handleSelectChannel = (channelId: string) => {
    dispatch(setSelectedChannelId(channelId));
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

  // The context menu action now simply dispatches open-Dialog actions
  const handleContextMenuAction = (action: string, channelId: string) => {
    const channelInContext = channels.find((c) => c._id === channelId);
    if (!channelInContext) return;

    switch (action) {
      case "view":
        dispatch(openViewChannelDetailsDialog(channelInContext));
        break;

      case "edit":
        dispatch(openEditChannelDialog(channelInContext));
        break;

      case "delete":
        dispatch(openDeleteChannelDialog(channelInContext));
        break;
      default:
        break;
    }
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
      <div className="flex items-center mb-4 pb-[1.53rem] border-b-[1px] border-dark-3 -mx-4 px-4">
        <h2 className="text-xl font-semibold text-light-1">Channels</h2>
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
      
      {/* Create Channel Button (moved to bottom) */}
      <div className="mt-auto pt-4 border-t border-dark-3 -mx-4 px-4">
        <button
          onClick={handleCreateChannelButtonClick}
          className="bg-primary-500 hover:bg-primary-600 text-white w-full py-2 rounded-md shadow-md flex items-center justify-center"
        >
          <span className="text-xl mr-2">+</span>
          <span>Create Channel</span>
        </button>
      </div>

      {/* Context Menu */}
      {channelContextMenu.isOpen && channelInContext && (
        <ChannelContextMenu
          channel={channelInContext}
          position={channelContextMenu.position}
          onClose={handleCloseContextMenu}
          onAction={(action) => handleContextMenuAction(action, channelInContext._id)}
        />
      )}

      {/* Create Channel Dialog (local state) */}
      {isCreateDialogOpen && (
        <CreateChannelDialog
          isOpen={isCreateDialogOpen}
          setIsOpen={setIsCreateDialogOpen}
          groupId={groupId}
        />
      )}

      {/* View Channel Details (Redux-based) */}
      {isViewChannelDetailsOpen && viewChannelDetailsData && (
        <ViewChannelDetails
          isOpen={isViewChannelDetailsOpen}
          onClose={() => dispatch(closeViewChannelDetailsDialog())}
          channel={viewChannelDetailsData}
        />
      )}

      {/* Edit Channel Dialog (Redux-based) */}
      {isEditChannelDialogOpen && editChannelData && (
        <EditChannelDialog
          isOpen={isEditChannelDialogOpen}
          setIsOpen={(val) => {
            if (!val) dispatch(closeEditChannelDialog());
          }}
          channel={editChannelData}
        />
      )}

      {/* Delete Channel Dialog (Redux-based) */}
      {isDeleteChannelDialogOpen && deleteChannelData && (
        <DeleteChannelDialog
          isOpen={isDeleteChannelDialogOpen}
          setIsOpen={(val) => {
            if (!val) dispatch(closeDeleteChannelDialog());
          }}
          channel={deleteChannelData}
        />
      )}
    </div>
  );
};

export default ChannelSidebar;
