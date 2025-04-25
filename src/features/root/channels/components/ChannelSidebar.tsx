// ChannelSidebar.tsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Import RTK Query hooks
import {
  useGetChannelsQuery,
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
import { FiPlus } from "react-icons/fi";

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

  // ===================
  // Conditional Renders
  // ===================
  if (isLoading) {
    return (
      <div className="bg-dark-2 text-light-2 w-full sm:w-[240px] md:w-72 lg:w-80 h-full min-h-[100dvh] sm:min-h-0 p-3 sm:p-3 md:p-4 lg:p-5 flex flex-col">
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-xl h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching channels: ", error);
    return (
      <div className="bg-dark-2 text-light-2 w-full sm:w-[240px] md:w-72 lg:w-80 h-full min-h-[100dvh] sm:min-h-0 p-3 sm:p-3 md:p-4 lg:p-5 flex flex-col">
        <div className="text-center p-4 md:p-6 bg-dark-3 rounded-xl border border-dark-5 shadow-sm">
          <p className="text-red-500 text-sm md:text-base font-medium">Error loading channels</p>
          <p className="text-light-3 text-xs md:text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  const channelInContext = channels.find(
    (c) => c._id === channelContextMenu.channelId
  );

  return (
    <div className="bg-dark-2 text-light-2 w-full sm:w-[240px] md:w-72 lg:w-80 h-full min-h-[100dvh] sm:min-h-0 max-h-[100dvh] p-3 sm:p-3 md:p-4 lg:p-5 flex flex-col relative overflow-hidden">
      {/* Header with Create Channel Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6 pb-3 md:pb-4 border-b-[1px] border-dark-4 -mx-3 md:-mx-4 lg:-mx-5 px-3 md:px-4 lg:px-5">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-light-1 mb-1 sm:mb-0">Channels</h1>
        <button
          onClick={handleCreateChannelButtonClick}
          className="bg-primary-500 hover:bg-primary-600 text-light-1 px-3 py-2 sm:p-2 md:p-3 rounded-lg md:rounded-xl shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center w-full sm:w-auto"
          title="Create Channel"
        >
          <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
          <span className="ml-2 text-sm md:text-base font-medium sm:hidden md:inline-block">Create</span>
        </button>
      </div>

      {/* Channel List Container */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {channels.length === 0 ? (
          <div className="text-center p-4 md:p-6 bg-dark-3 rounded-lg md:rounded-xl border border-dark-5 shadow-sm my-2">
            <p className="text-light-1 text-sm md:text-base font-medium">No channels yet</p>
            <p className="text-light-3 text-xs md:text-sm mt-2">Create your first channel</p>
          </div>
        ) : (
          <div className="overflow-y-auto custom-scrollbar">
            <ChannelList
              channels={channels.map((ch) => ({
                id: ch._id,
                name: ch.channelName,
              }))}
              selectedChannelId={selectedChannelId}
              onChannelClick={handleSelectChannel}
              onChannelContextMenu={handleChannelContextMenu}
            />
          </div>
        )}
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
