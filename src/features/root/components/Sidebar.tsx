// Sidebar.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiCpu,
  FiVideo,
  FiPlusCircle,
  FiMoreVertical,
  FiX,
} from "react-icons/fi";

// UI components
import SidebarLogo from "../groups/components/Logo";
import SidebarDivider from "../groups/components/SidebarDivider";
import AddGroupButton from "../groups/components/AddGroupButton";
import ModalsManager from "./ModalsManager";
import CreateChannelDialog from "../chats/components/dialogs/CreateChannelDialog";
import DeleteGroupDialog from "../groups/dialogs/DeleteGroupDialog";
import LeaveGroupDialog from "../groups/dialogs/LeaveGroupDialog";
import EditGroupDialog from "../groups/dialogs/EditGroupDialog";

// Redux logic
import { AuthState } from "@/features/auth/slices/authSlice";
import { useCreateChannelMutation } from "../channels/slices/channelApiSlice";
import { useGetJoinedGroupsQuery } from "../groups/slices/groupApiSlice";
import {
  selectSelectedGroupId,
  setSelectedGroupId,
  openContextMenu,
  closeContextMenu,
  selectGroupContextMenu,
  openViewGroupDetailsModal,
  selectIsViewGroupDetailsModalOpen,
  closeViewGroupDetailsModal,
  selectViewGroupDetailsData,
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
import GroupContextMenu from "../groups/components/GroupContextMenu";

interface SidebarProps {
  onCloseDrawer?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCloseDrawer }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Logged-in user
  const userId = useSelector(
    (state: { auth: AuthState }) => state.auth.user?._id ?? ""
  );

  // Group selection and context menu
  const selectedGroupId = useSelector(selectSelectedGroupId);
  const groupContextMenu = useSelector(selectGroupContextMenu);

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
  } = useGetJoinedGroupsQuery(userId, { skip: !userId });

  // RTK Query: create channel
  const [createChannel] = useCreateChannelMutation();

  // ----------------------------------
  // Local state for modals
  // ----------------------------------
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] =
    React.useState(false);
  const [isJoinGroupModalOpen, setJoinGroupModalOpen] = React.useState(false);
  const [isChannelDialogOpen, setIsChannelDialogOpen] = React.useState(false);
  // ----------------------------------
  // Handlers
  // ----------------------------------
  const handleLogoClick = () => {
    // First set navigation source
    dispatch(setNavigationSource('user_action'));
    // Then navigate
    navigate('/');
    // Finally set selected group ID to null
    setTimeout(() => {
      dispatch(setSelectedGroupId(null));
    }, 50);
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

  // Context menu: open on right-click
  const handleGroupContextMenu = (e: React.MouseEvent, groupId: string) => {
    e.preventDefault();
    dispatch(
      openContextMenu({
        position: { x: e.pageX, y: e.pageY },
        groupId,
      })
    );
  };

  const handleCloseContextMenu = () => {
    dispatch(closeContextMenu());
  };

  // Add Group button: open create or join modals
  const handleCreateGroup = () => {
    // First set navigation source
    dispatch(setNavigationSource('user_action'));
    // Then open modal
    setCreateGroupModalOpen(true);
    // Finally set selected group ID to null with a small delay
    setTimeout(() => {
      dispatch(setSelectedGroupId(null));
    }, 50);
  };
  
  const handleJoinGroup = () => {
    // First set navigation source
    dispatch(setNavigationSource('user_action'));
    // Then open modal
    setJoinGroupModalOpen(true);
    // Finally set selected group ID to null with a small delay
    setTimeout(() => {
      dispatch(setSelectedGroupId(null));
    }, 50);
  };

  // Create channel confirm
  const handleCreateChannelConfirm = async (
    channelName: string,
    description: string
  ) => {
    try {
      if (!selectedGroupId) return;
      await createChannel({
        groupId: selectedGroupId,
        channelName,
        description,
      }).unwrap();
      console.log("Channel created successfully!");
    } catch (err) {
      console.error("Error creating channel: ", err);
    }
  };

  const handleContextMenuAction = (action: string, groupId: string) => {
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

      default:
        break;
    }
    handleCloseContextMenu();
  };

  // Example placeholders, you can do actual logic within the dialogs
  const handleDeleteGroup = (groupName: string) => {
    console.log(`Deleting group: ${groupName}`);
  };

  const handleLeaveGroup = (groupName: string) => {
    console.log(`Leaving group: ${groupName}`);
  };

  // ----------------------------------
  // Conditional Rendering
  // ----------------------------------
  if (isLoading) {
    return (
      <div className="w-20 bg-dark-1 h-full p-3 flex flex-col items-center">
        <SidebarLogo onClick={handleLogoClick} />
        <SidebarDivider />
        <div className="text-light-3 mt-4">Loading your groups...</div>
      </div>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <div className="w-20 bg-dark-1 h-full p-3 flex flex-col items-center">
        <SidebarLogo onClick={handleLogoClick} />
        <SidebarDivider />
        <div className="text-red mt-4">Error loading groups</div>
      </div>
    );
  }

  // The group currently under right-click context
  const groupInContext = groupContextMenu.groupId
    ? joinedGroups.find((g) => g._id === groupContextMenu.groupId)
    : null;

  return (
    <div className="w-full sm:w-60 md:w-32 bg-dark-1 h-full flex flex-col items-center overflow-hidden relative">
      <div className="mt-4 mb-2 hidden md:block">
        <SidebarLogo onClick={handleLogoClick} />
      </div>

      {/* Only show divider if logo is visible */}
      <div className="hidden md:block">
        <SidebarDivider />
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col w-full">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            `w-full py-4 flex flex-col items-center justify-center transition-transform duration-300 ${
              isActive ? "bg-dark-6 rounded-full p-0" : " hover:scale-110 md:hover:scale-150"
            }`
          }
          onClick={() => handleNavigationClick('/home')}
          title="Home"
        >
          <FiHome size={20} className="text-light-3" />
        </NavLink>

        <NavLink
          to="/discover-groups"
          className={({ isActive }) =>
            `w-full py-4 flex flex-col items-center justify-center  transition-transform duration-300 ${
              isActive ? "bg-dark-6 rounded-full p-0" : " hover:scale-110 md:hover:scale-150"
            }`
          }
          onClick={() => handleNavigationClick('/discover-groups')}
          title="Discover Groups"
        >
          <FiUsers size={20} className="text-light-3" />
        </NavLink>

        <NavLink
          to="/scheduled-meetings"
          className={({ isActive }) =>
            `w-full py-4 flex flex-col items-center justify-center transition-transform duration-300 ${
              isActive ? "bg-dark-6 rounded-full p-0" : " hover:scale-110 md:hover:scale-150"
            }`
          }
          onClick={() => handleNavigationClick('/scheduled-meetings')}
          title="Scheduled Meetings"
        >
          <FiCalendar size={20} className="text-light-3" />
        </NavLink>

        <NavLink
          to="/ai-quiz-generation"
          className={({ isActive }) =>
            `w-full py-4 flex flex-col items-center justify-center transition-transform duration-300 ${
              isActive ? "bg-dark-6 rounded-full p-0" : " hover:scale-110 md:hover:scale-150"
            }`
          }
          onClick={() => handleNavigationClick('/ai-quiz-generation')}
          title="AI Quiz Generation"
        >
          <FiCpu size={20} className="text-light-3" />
        </NavLink>

        <NavLink
          to="/meeting-recordings"
          className={({ isActive }) =>
            `w-full py-4 flex flex-col items-center justify-center  transition-transform duration-300 ${
              isActive ? "bg-dark-6 rounded-full p-0" : " hover:scale-110 md:hover:scale-150"
            }`
          }
          onClick={() => handleNavigationClick('/meeting-recordings')}
          title="Meeting Recordings"
        >
          <FiVideo size={20} className="text-light-3" />
        </NavLink>
      </nav>

      <SidebarDivider />

      {/* List Groups */}
      <Groups
        joinedGroups={joinedGroups}
        selectedGroupId={selectedGroupId || ""}
        onGroupClick={handleGroupClick}
        onGroupContextMenu={(e, group) => handleGroupContextMenu(e, group._id)}
        onCloseContextMenu={handleCloseContextMenu}
      />

      {/* Group Context Menu (visible if the user right-clicked a group) */}
      {groupContextMenu.isOpen && groupInContext && (
        <GroupContextMenu
          group={groupInContext}
          position={groupContextMenu.position}
          onClose={handleCloseContextMenu}
          onAction={(action) =>
            handleContextMenuAction(action, groupInContext._id)
          }
        />
      )}

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

      {/* Central modals manager for Create/Join + optional View Details */}
      <ModalsManager
        // Join group
        isJoinGroupModalOpen={isJoinGroupModalOpen}
        closeJoinGroupModal={() => setJoinGroupModalOpen(false)}
        // Create group
        isCreateGroupModalOpen={isCreateGroupModalOpen}
        closeCreateGroupModal={() => setCreateGroupModalOpen(false)}
        // View group details (if using Redux-based approach)
        isViewGroupDetailsModalOpen={isViewGroupDetailsModalOpen}
        closeViewGroupDetailsModal={() =>
          dispatch(closeViewGroupDetailsModal())
        }
      />

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
    </div>
  );
};

export default Sidebar;
