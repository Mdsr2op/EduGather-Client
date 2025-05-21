// Sidebar.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiBell,
  FiVideo,
} from "react-icons/fi";

// UI components
import SidebarDivider from "../groups/components/SidebarDivider";
import AddGroupButton from "../groups/components/AddGroupButton";
import CreateChannelDialog from "../chats/components/dialogs/CreateChannelDialog";
import DeleteGroupDialog from "../groups/dialogs/DeleteGroupDialog";
import LeaveGroupDialog from "../groups/dialogs/LeaveGroupDialog";
import EditGroupDialog from "../groups/dialogs/EditGroupDialog";
import ViewGroupDetails from "../groups/dialogs/ViewGroupDetails";
import ViewUserProfile from "@/features/auth/components/ViewUserProfile";
import CreateGroupDialog from "../groups/dialogs/CreateGroupDialog";

// Redux logic
import { AuthState } from "@/features/auth/slices/authSlice";
import { useGetJoinedGroupsQuery } from "../groups/slices/groupApiSlice";

import {
  selectSelectedGroupId,
  setSelectedGroupId,
  selectIsViewGroupDetailsModalOpen,
  closeViewGroupDetailsModal,
  openViewGroupDetailsModal,
  openEditGroupDialog,
  closeEditGroupDialog,
  openDeleteGroupDialog,
  closeDeleteGroupDialog,
  openLeaveGroupDialog,
  closeLeaveGroupDialog,
  selectIsEditGroupDialogOpen,
  selectEditGroupData,
  selectIsDeleteGroupDialogOpen,
  selectDeleteGroupData,
  selectIsLeaveGroupDialogOpen,
  selectLeaveGroupData,
  setNavigationSource,
} from "../groups/slices/groupSlice";

import Groups from "../groups/components/Groups";
import UserAvatar from "./UserAvatar";
import { selectUnreadCount, setUnreadCount, useGetNotificationsQuery } from "../notifications";
import InviteToGroupDialog from "../groups/dialogs/InviteToGroupDialog";
import { useTheme } from "@/context/ThemeContext";

interface SidebarProps {
  onCloseDrawer?: () => void;
  onGroupContextMenu: (e: React.MouseEvent, groupId: string) => void;
  onCloseContextMenu: () => void;
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onCloseDrawer, 
  onGroupContextMenu, 
  onCloseContextMenu,
  isSidebarOpen
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Logged-in user
  const user = useSelector(
    (state: { auth: AuthState }) => state.auth.user
  );

  // Get unread notification count from Redux store
  const unreadCount = useSelector(selectUnreadCount);
  
  // Fetch notifications data to set unread count
  const { data: notificationsData } = useGetNotificationsQuery({}, {
    skip: !user?._id, // Skip if user is not logged in
  });
  
  // Update unread count in Redux store when notifications data changes
  useEffect(() => {
    if (notificationsData?.data?.notifications) {
      const unreadNotifications = notificationsData.data.notifications.filter(
        (notification: any) => !notification.isRead
      ).length;
      
      dispatch(setUnreadCount(unreadNotifications));
    }
  }, [notificationsData, dispatch]);

  // Group selection and context menu
  const selectedGroupId = useSelector(selectSelectedGroupId);

  // For "View Group Details" if using Redux-based approach
  const isViewGroupDetailsModalOpen = useSelector(
    selectIsViewGroupDetailsModalOpen
  );

  const isEditGroupDialogOpen = useSelector(selectIsEditGroupDialogOpen);
  const editGroupData = useSelector(selectEditGroupData);

  const isDeleteGroupDialogOpen = useSelector(selectIsDeleteGroupDialogOpen);
  const deleteGroupData = useSelector(selectDeleteGroupData);

  const isLeaveGroupDialogOpen = useSelector(selectIsLeaveGroupDialogOpen);
  const leaveGroupData = useSelector(selectLeaveGroupData);

  // Fetch joined groups
  const {
    data: joinedGroups = [],
    isLoading,
    isError,
    error,
  } = useGetJoinedGroupsQuery(user?._id ?? "", { skip: !user?._id });

  // ----------------------------------
  // Local state for modals
  // ----------------------------------

  const [isChannelDialogOpen, setIsChannelDialogOpen] = React.useState(false);
  const [isUserProfileOpen, setUserProfileOpen] = React.useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = React.useState(false);
  const [inviteGroupData, setInviteGroupData] = React.useState<any>(null);
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = React.useState(false);
  
  // ----------------------------------
  // Listen for context menu actions from RootLayout
  // ----------------------------------
  useEffect(() => {
    const handleContextMenuAction = (event: CustomEvent) => {
      const { action, groupId } = event.detail;
      const groupInContext = joinedGroups.find((g) => g._id === groupId);
      if (!groupInContext) return;
      
      switch (action) {
        case "view":
          dispatch(openViewGroupDetailsModal(groupInContext));
          break;

        case "edit":
          dispatch(openEditGroupDialog(groupInContext));
          break;

        case "delete":
          dispatch(openDeleteGroupDialog(groupInContext));
          break;

        case "create-channel":
          setIsChannelDialogOpen(true);
          break;

        case "leave":
          dispatch(openLeaveGroupDialog(groupInContext));
          break;

        case "invite":
          setInviteGroupData(groupInContext);
          setIsInviteDialogOpen(true);
          break;
        default:
          break;
      }
    };

    document.addEventListener('group-context-menu-action', handleContextMenuAction as EventListener);
    return () => {
      document.removeEventListener('group-context-menu-action', handleContextMenuAction as EventListener);
    };
  }, [dispatch, joinedGroups]);

  // ----------------------------------
  // Handlers
  // ----------------------------------
  const handleLogoClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    
    // Open user profile dialog
    setUserProfileOpen(true);
  };

  const handleGroupClick = (groupId: string) => {
    // First navigate to the group
    navigate(`/${groupId}/channels`);
    // Close the drawer on mobile if applicable
    if (onCloseDrawer) onCloseDrawer();
    // Then set the selected group ID
    dispatch(setSelectedGroupId(groupId));
  };

  const handleNavigationClick = (path: string) => {
    // Debug with localStorage
    localStorage.setItem('lastNavigation', `User clicked on ${path}`);
    console.log(`Setting navigation source to user_action for ${path}`);
    
    // First set navigation source
    dispatch(setNavigationSource('user_action'));
    // Then navigate
    navigate(path);
    // Close the drawer on mobile if applicable
    if (onCloseDrawer) onCloseDrawer();
    // Finally set selected group ID to null with a small delay
    setTimeout(() => {
      console.log(`Setting selectedGroupId to null for ${path}`);
      dispatch(setSelectedGroupId(null));
    }, 50);
  };

  // Add Group button: open create or join modals
  const handleCreateGroup = () => {
    // First set navigation source
    dispatch(setNavigationSource('user_action'));
    // Open create group dialog
    setIsCreateGroupDialogOpen(true);
    
    // Finally set selected group ID to null with a small delay
    setTimeout(() => {
      dispatch(setSelectedGroupId(null));
    }, 50);
  };

  // ----------------------------------
  // Conditional Rendering
  // ----------------------------------
  if (isLoading) {
    return (
      <div className={`w-20 ${theme === 'dark' ? 'bg-dark-1' : 'bg-light-bg-1'} h-full p-3 flex flex-col items-center`}>
        <UserAvatar onClick={handleLogoClick} user={user} />
        <SidebarDivider />
        <div className={`${theme === 'dark' ? 'text-light-3' : 'text-light-text-3'} mt-4`}>Loading your groups...</div>
      </div>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <div className={`w-20 ${theme === 'dark' ? 'bg-dark-1' : 'bg-light-bg-1'} h-full p-3 flex flex-col items-center`}>
        <UserAvatar onClick={handleLogoClick} user={user} />
        <SidebarDivider />
        <div className="text-red mt-4">Error loading groups</div>
      </div>
    );
  }

  return (
    <div className={`w-full sm:w-60 md:w-32 ${theme === 'dark' ? 'bg-dark-1' : 'bg-light-bg-1'} h-full flex flex-col items-center overflow-hidden relative`}>
      <div className="mt-4 mb-2 transition-opacity duration-300 opacity-100">
        <UserAvatar onClick={handleLogoClick} user={user} />
      </div>

      {/* Only show divider if logo is visible */}
      <div className={`transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
        <SidebarDivider />
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col w-full">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `w-full py-4 flex flex-col items-center justify-center transition-transform duration-300 ${
              isActive ? `${theme === 'dark' ? 'bg-dark-6' : 'bg-light-bg-4'} rounded-full p-0` : " hover:scale-110 md:hover:scale-150"
            }`
          }
          onClick={() => handleNavigationClick('/home')}
          title="Home"
        >
          <FiHome size={20} className={`${theme === 'dark' ? 'text-light-3' : 'text-light-text-3'}`} />
        </NavLink>

        <NavLink
          to="/discover-groups"
          className={({ isActive }) =>
            `w-full py-4 flex flex-col items-center justify-center  transition-transform duration-300 ${
              isActive ? `${theme === 'dark' ? 'bg-dark-6' : 'bg-light-bg-4'} rounded-full p-0` : " hover:scale-110 md:hover:scale-150"
            }`
          }
          onClick={() => handleNavigationClick('/discover-groups')}
          title="Discover Groups"
        >
          <FiUsers size={20} className={`${theme === 'dark' ? 'text-light-3' : 'text-light-text-3'}`} />
        </NavLink>

        <NavLink
          to="/scheduled-meetings"
          className={({ isActive }) =>
            `w-full py-4 flex flex-col items-center justify-center transition-transform duration-300 ${
              isActive ? `${theme === 'dark' ? 'bg-dark-6' : 'bg-light-bg-4'} rounded-full p-0` : " hover:scale-110 md:hover:scale-150"
            }`
          }
          onClick={() => handleNavigationClick('/scheduled-meetings')}
          title="Scheduled Meetings"
        >
          <FiCalendar size={20} className={`${theme === 'dark' ? 'text-light-3' : 'text-light-text-3'}`} />
        </NavLink>

        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            `w-full py-4 flex flex-col items-center justify-center transition-transform duration-300 ${
              isActive ? `${theme === 'dark' ? 'bg-dark-6' : 'bg-light-bg-4'} rounded-full p-0` : " hover:scale-110 md:hover:scale-150"
            }`
          }
          onClick={() => handleNavigationClick('/notifications')}
          title="Notifications"
        >
          <div className="relative group p-1">
            <FiBell size={20} className={`${theme === 'dark' ? 'text-light-3' : 'text-light-text-3'} ${unreadCount > 0 ? 'text-yellow-500 light:text-light-secondary-500' : ''}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 right-0 translate-x-1/2 p-[9px] bg-secondary-500 light:bg-light-secondary-500 text-dark-1 light:text-light-1 font-bold text-xs rounded-full w-4 h-4 flex items-center justify-center shadow-md animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
        </NavLink>

        <NavLink
          to="/meeting-recordings"
          className={({ isActive }) =>
            `w-full py-4 flex flex-col items-center justify-center  transition-transform duration-300 ${
              isActive ? `${theme === 'dark' ? 'bg-dark-6' : 'bg-light-bg-4'} rounded-full p-0` : " hover:scale-110 md:hover:scale-150"
            }`
          }
          onClick={() => handleNavigationClick('/meeting-recordings')}
          title="Meeting Recordings"
        >
          <FiVideo size={20} className={`${theme === 'dark' ? 'text-light-3' : 'text-light-text-3'}`} />
        </NavLink>
      </nav>

      <SidebarDivider />

      {/* List Groups */}
      <Groups
        joinedGroups={joinedGroups}
        selectedGroupId={selectedGroupId || ""}
        onGroupClick={handleGroupClick}
        onGroupContextMenu={(e, group) => onGroupContextMenu(e, group._id)}
        onCloseContextMenu={onCloseContextMenu}
      />

      <SidebarDivider />

      {/* Add Group Button */}
      <div className="mb-4">
        <AddGroupButton
          onClick={handleCreateGroup}
          onContextMenu={(e) => {
            e.preventDefault();
            console.log("Right-click on AddGroupButton");
          }}
          title="Add a Group"
        />
      </div>

      <SidebarDivider />



      {/* View Group Details Dialog */}
      {isViewGroupDetailsModalOpen && (
        <ViewGroupDetails
          isOpen={isViewGroupDetailsModalOpen}
          onClose={() => dispatch(closeViewGroupDetailsModal())}
        />
      )}

      {/* Create Channel Dialog */}
      {isChannelDialogOpen && (
        <CreateChannelDialog
          isOpen={isChannelDialogOpen}
          setIsOpen={setIsChannelDialogOpen}
          groupId={selectedGroupId}
        />
      )}

      {isEditGroupDialogOpen && editGroupData && (
        <EditGroupDialog
          isOpen={isEditGroupDialogOpen}
          setIsOpen={() => dispatch(closeEditGroupDialog())}
          group={editGroupData}
        />
      )}

      {isDeleteGroupDialogOpen && deleteGroupData && (
        <DeleteGroupDialog
          groupName={deleteGroupData.name}
          groupId={deleteGroupData._id}
          isOpen={isDeleteGroupDialogOpen}
          setIsOpen={() => dispatch(closeDeleteGroupDialog())}
        />
      )}

      {isLeaveGroupDialogOpen && leaveGroupData && (
        <LeaveGroupDialog
        groupId={selectedGroupId}
          groupName={leaveGroupData.name}
          isOpen={isLeaveGroupDialogOpen}
          setIsOpen={() => dispatch(closeLeaveGroupDialog())}
        />
      )}

      {/* User Profile Dialog */}
      <ViewUserProfile
        isOpen={isUserProfileOpen}
        onClose={() => setUserProfileOpen(false)}
        user={user}
      />

      {/* Invite to Group Dialog */}
      {isInviteDialogOpen && inviteGroupData && (
        <InviteToGroupDialog
          isOpen={isInviteDialogOpen}
          onClose={() => setIsInviteDialogOpen(false)}
          group={inviteGroupData}
        />
      )}

      {/* Create Group Dialog */}
      <CreateGroupDialog
        isOpen={isCreateGroupDialogOpen}
        onClose={() => setIsCreateGroupDialogOpen(false)}
      />
    </div>
  );
};

export default Sidebar;
