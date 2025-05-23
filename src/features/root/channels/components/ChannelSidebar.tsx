// ChannelSidebar.tsx

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/redux/hook";

// Import RTK Query hooks
import {
  useGetChannelsQuery,
} from "../slices/channelApiSlice";
import { useGetGroupDetailsQuery } from "../../groups/slices/groupApiSlice";

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
import { FiPlus, FiSearch } from "react-icons/fi";
import InfiniteScroll from "react-infinite-scroll-component";
import { Input } from "@/components/ui/input";

interface ChannelSidebarProps {
  groupId: string;
}

const ChannelSidebar: React.FC<ChannelSidebarProps> = ({ groupId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Get current user ID from auth state
  const currentUserId = useAppSelector(state => state.auth.user?._id);
  
  // ===================
  // Pagination and Search State
  // ===================
  const [page, setPage] = useState<number>(1);
  const [allChannels, setAllChannels] = useState<{ id: string; name: string }[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // ===================
  // Data Fetching
  // ===================
  const {
    data: channelData,
    isLoading,
    isError,
    error,
  } = useGetChannelsQuery({ groupId, page, limit: 20 }, {
    skip: !groupId,
  });

  // Get group details to check user role
  const { data: groupDetails } = useGetGroupDetailsQuery(groupId, {
    skip: !groupId,
  });
  
  // Update allChannels when new data is fetched
  useEffect(() => {
    if (channelData?.data.channels) {
      const newChannels = channelData.data.channels.map(ch => ({
        id: ch._id,
        name: ch.channelName,
      }));
      
      if (page === 1) {
        setAllChannels(newChannels);
      } else {
        setAllChannels(prev => [...prev, ...newChannels]);
      }
      
      // Update hasMore based on pagination info
      setHasMore(channelData.data.hasNextPage);
    }
  }, [channelData, page]);
  
  const loadMoreChannels = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);
  
  // Filter channels based on search query
  const filteredChannels = searchQuery
    ? allChannels.filter(channel => 
        channel.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allChannels;
  
  // Check if current user is an admin or moderator in this group
  const userRole = currentUserId && groupDetails?.members?.find(
    member => member._id === currentUserId
  )?.role || "member";
  
  const canCreateChannel = userRole === "admin" || userRole === "moderator";
  const canManageChannels = canCreateChannel;
  
  // For local state controlling the "Create Channel" button
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // ===================
  // Handlers
  // ===================

  // Left-click a channel to select it
  const handleSelectChannel = (channelId: string) => {
    dispatch(setSelectedChannelId(channelId));
    navigate(`/${groupId}/${channelId}`);
    
    // Close sidebar on mobile by dispatching a custom event
    const event = new CustomEvent('close-mobile-sidebar');
    document.dispatchEvent(event);
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
    const channelInContext = channelData?.data.channels.find((c) => c._id === channelId);
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
  if (isLoading && page === 1) {
    return (
      <div className="bg-dark-2 dark:bg-dark-2 light:bg-light-bg-2 text-light-2 dark:text-light-2 light:text-light-text-2 w-full sm:w-[240px] md:w-72 lg:w-80 h-full min-h-[100dvh] sm:min-h-0 p-3 sm:p-3 md:p-4 lg:p-5 flex flex-col">
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-xl h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching channels: ", error);
    return (
      <div className="bg-dark-2 dark:bg-dark-2 light:bg-light-bg-2 text-light-2 dark:text-light-2 light:text-light-text-2 w-full sm:w-[240px] md:w-72 lg:w-80 h-full min-h-[100dvh] sm:min-h-0 p-3 sm:p-3 md:p-4 lg:p-5 flex flex-col">
        <div className="text-center p-4 md:p-6 bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl border border-dark-5 dark:border-dark-5 light:border-light-bg-5 shadow-sm">
          <p className="text-red-500 text-sm md:text-base font-medium">Error loading channels</p>
          <p className="text-light-3 dark:text-light-3 light:text-light-text-3 text-xs md:text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  const channelInContext = channelData?.data.channels.find(
    (c) => c._id === channelContextMenu.channelId
  );

  return (
    <div className="bg-dark-2 dark:bg-dark-2 light:bg-light-bg-2 text-light-2 dark:text-light-2 light:text-light-text-2 w-full sm:w-[240px] md:w-72 lg:w-80 h-full min-h-[100dvh] sm:min-h-0 max-h-[100dvh] p-3 pt-16 sm:p-3 md:p-4 lg:p-5 flex flex-col relative overflow-hidden ">
      {/* Header with Create Channel Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-4 md:mb-6 pb-3 md:pb-4 border-b-[1px] border-dark-4 dark:border-dark-4 light:border-light-bg-4 -mx-3 md:-mx-4 lg:-mx-5 px-3 md:px-4 lg:px-5">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-light-1 dark:text-light-1 light:text-light-text-1 mb-1 sm:mb-0">Channels</h1>
        {canCreateChannel && (
          <button
            onClick={handleCreateChannelButtonClick}
            className="bg-primary-500 hover:bg-primary-600 text-light-1 dark:text-light-1 light:text-light-1 px-3 py-2 sm:p-2 md:p-3 rounded-lg md:rounded-xl shadow-md hover:shadow-xl transition-all duration-200 flex items-center justify-center w-full sm:w-auto"
            title="Create Channel"
          >
            <FiPlus className="w-4 h-4 md:w-5 md:h-5" />
            <span className="ml-2 text-sm md:text-base font-medium sm:hidden md:inline-block">Create</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-3 dark:text-light-3 light:text-light-text-3" size={16} />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 border-dark-5 dark:border-dark-5 light:border-light-bg-5 text-light-1 dark:text-light-1 light:text-light-text-1 placeholder-light-3 dark:placeholder-light-3 light:placeholder-light-text-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl text-sm shadow-inner w-full"
          />
        </div>
        {searchQuery && (
          <div className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3 mt-2 px-1">
            Found {filteredChannels.length} {filteredChannels.length === 1 ? 'channel' : 'channels'}
          </div>
        )}
      </div>

      {/* Channel List Container */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0" id="channelScrollContainer">
        {filteredChannels.length === 0 && !isLoading ? (
          <div className="text-center p-4 md:p-6 bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-lg md:rounded-xl border border-dark-5 dark:border-dark-5 light:border-light-bg-5 shadow-sm my-2">
            <p className="text-light-1 dark:text-light-1 light:text-light-text-1 text-sm md:text-base font-medium">
              {searchQuery ? "No channels match your search" : "No channels yet"}
            </p>
            <p className="text-light-3 dark:text-light-3 light:text-light-text-3 text-xs md:text-sm mt-2">
              {searchQuery ? "Try a different search term" : "Create your first channel"}
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto custom-scrollbar">
            <InfiniteScroll
              dataLength={filteredChannels.length}
              next={loadMoreChannels}
              hasMore={!searchQuery && hasMore}
              loader={
                <div className="flex justify-center items-center p-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              }
              scrollableTarget="channelScrollContainer"
              className="overflow-hidden"
              endMessage={<></>}
            >
              <ChannelList
                channels={filteredChannels}
                selectedChannelId={selectedChannelId}
                onChannelClick={handleSelectChannel}
                onChannelContextMenu={handleChannelContextMenu}
              />
            </InfiniteScroll>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {channelContextMenu.isOpen && channelInContext && (
        <ChannelContextMenu
          channel={channelInContext}
          position={channelContextMenu.position}
          onClose={handleCloseContextMenu}
          canManageChannels={canManageChannels}
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
