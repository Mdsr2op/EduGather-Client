// Sidebar.tsx

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// UI components
import SidebarLogo from "../groups/components/SidebarLogo";
import SidebarDivider from "../groups/components/SidebarDivider";
import AddGroupButton from "../groups/components/AddGroupButton";
import ModalsManager from "./ModalsManager";
import CreateChannelDialog from "../chats/components/dialogs/CreateChannelDialog";
import DeleteGroupDialog from "../groups/dialogs/DeleteGroupDialog";
import LeaveGroupDialog from "../groups/dialogs/LeaveGroupDialog";
import EditGroupDialog from "../groups/dialogs/EditGroupDialog"; // <-- Import your EditGroupDialog

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
  // If you want "View Details" via Redux:
  openViewGroupDetailsModal,
  selectIsViewGroupDetailsModalOpen,
  closeViewGroupDetailsModal,
  selectViewGroupDetailsData,
} from "../groups/slices/groupSlice";

import Groups from "../groups/components/Groups";
import GroupContextMenu from "../groups/components/GroupContextMenu";

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Logged-in user
  const userId = useSelector(
    (state: { auth: AuthState }) => state.auth.user?._id ?? ""
  );

  // Group selection and context menu
  const selectedGroupId = useSelector(selectSelectedGroupId);
  const groupContextMenu = useSelector(selectGroupContextMenu);

  // For "View Group Details" if using Redux-based approach
  const isViewGroupDetailsModalOpen = useSelector(selectIsViewGroupDetailsModalOpen);
  const viewGroupDetailsData = useSelector(selectViewGroupDetailsData);

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
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [isJoinGroupModalOpen, setJoinGroupModalOpen] = useState(false);
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);
  const [isLeaveGroupDialogOpen, setIsLeaveGroupDialogOpen] = useState(false);
  const [isEditGroupDialogOpen, setIsEditGroupDialogOpen] = useState(false);

  // ----------------------------------
  // Handlers
  // ----------------------------------
  const handleGroupClick = (groupId: string) => {
    dispatch(setSelectedGroupId(groupId));
    navigate(`/${groupId}/channels`);
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
  const handleCreateGroup = () => setCreateGroupModalOpen(true);
  const handleJoinGroup = () => setJoinGroupModalOpen(true);

  // Create channel confirm
  const handleCreateChannelConfirm = async (channelName: string, description: string) => {
    try {
      if (!selectedGroupId) return;
      await createChannel({ groupId: selectedGroupId, channelName, description }).unwrap();
      console.log("Channel created successfully!");
    } catch (err) {
      console.error("Error creating channel: ", err);
    }
  };

  // Context menu actions
  const handleContextMenuAction = (action: string, groupId: string) => {
    const groupInContext = joinedGroups.find((g) => g._id === groupId);
    switch (action) {
      case "view":
        console.log(`View details for group ${groupId}`);
        // If using Redux-based "ViewGroupDetails":
        if (groupInContext) {
          dispatch(openViewGroupDetailsModal(groupInContext));
        }
        break;

      case "edit":
        console.log(`Edit group ${groupId}`);
        setIsEditGroupDialogOpen(true);
        break;

      case "delete":
        setIsDeleteGroupDialogOpen(true);
        break;

      case "create-channel":
        setIsChannelDialogOpen(true);
        break;

      case "leave":
        setIsLeaveGroupDialogOpen(true);
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
        <SidebarLogo onClick={() => dispatch(setSelectedGroupId(null))} />
        <SidebarDivider />
        <div>Loading your groups...</div>
      </div>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <div className="w-20 bg-dark-1 h-full p-3 flex flex-col items-center">
        <SidebarLogo onClick={() => dispatch(setSelectedGroupId(null))} />
        <SidebarDivider />
        <div>Error loading groups</div>
      </div>
    );
  }

  // The group currently under right-click context
  const groupInContext = groupContextMenu.groupId
    ? joinedGroups.find((g) => g._id === groupContextMenu.groupId)
    : null;

  return (
    <div className="w-20 bg-dark-1 h-full p-3 flex flex-col items-center overflow-hidden">
      {/* Logo: reset selection if clicked */}
      <SidebarLogo onClick={() => dispatch(setSelectedGroupId(null))} />

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
          onAction={(action) => handleContextMenuAction(action, groupInContext._id)}
        />
      )}

      <SidebarDivider />

      {/* Add Group Button */}
      <AddGroupButton
        onClick={handleCreateGroup}
        onContextMenu={(e) => {
          e.preventDefault();
          console.log("Right-click on AddGroupButton");
        }}
        title="Add a Group"
      />

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
        closeViewGroupDetailsModal={() => dispatch(closeViewGroupDetailsModal())}
        viewGroupDetailsData={viewGroupDetailsData}
      />

      {/* Create Channel Dialog */}
      {isChannelDialogOpen && (
        <CreateChannelDialog
          isOpen={isChannelDialogOpen}
          setIsOpen={setIsChannelDialogOpen}
          onConfirm={handleCreateChannelConfirm}
        />
      )}

      {/* Delete Group Dialog */}
      {isDeleteGroupDialogOpen && groupInContext && (
        <DeleteGroupDialog
          groupName={groupInContext.name}
          groupId={groupInContext._id}
          onDelete={(groupName: string) => handleDeleteGroup(groupName)}
          isOpen={isDeleteGroupDialogOpen}
          setIsOpen={setIsDeleteGroupDialogOpen}
        />
      )}

      {/* Leave Group Dialog */}
      {isLeaveGroupDialogOpen && groupInContext && (
        <LeaveGroupDialog
          groupName={groupInContext.name}
          onLeave={(groupName: string) => handleLeaveGroup(groupName)}
          isOpen={isLeaveGroupDialogOpen}
          setIsOpen={setIsLeaveGroupDialogOpen}
        />
      )}

      {/* Edit Group Dialog */}
      {isEditGroupDialogOpen && groupInContext && (
        <EditGroupDialog
          isOpen={isEditGroupDialogOpen}
          setIsOpen={setIsEditGroupDialogOpen}
          group={groupInContext}
        />
      )}
    </div>
  );
};

export default Sidebar;
