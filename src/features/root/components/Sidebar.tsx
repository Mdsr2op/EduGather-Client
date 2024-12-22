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

// Redux logic
import {
  useGetJoinedGroupsQuery,
} from "../groups/slices/groupApiSlice";
import {
  selectSelectedGroupId,
  setSelectedGroupId,
  openContextMenu,
  closeContextMenu,
  selectGroupContextMenu,
} from "../groups/slices/groupSlice";
import { AuthState } from "@/features/auth/slices/authSlice";
import Groups from "../groups/components/Groups";
import GroupContextMenu from "../groups/components/GroupContextMenu";

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = useSelector(
    (state: { auth: AuthState }) => state.auth.user?._id ?? ""
  );

  const selectedGroupId = useSelector(selectSelectedGroupId);
  const groupContextMenu = useSelector(selectGroupContextMenu);

  const {
    data: joinedGroups = [], 
    isLoading,
    isError,
    error,
  } = useGetJoinedGroupsQuery(userId, { skip: !userId });

  // -------------------------
  // Local states 
  // -------------------------
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [isJoinGroupModalOpen, setJoinGroupModalOpen] = useState(false);
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);
  const [isDeleteGroupDialogOpen, setIsDeleteGroupDialogOpen] = useState(false);
  const [isLeaveGroupDialogOpen, setIsLeaveGroupDialogOpen] = useState(false);


  const handleGroupClick = (groupId: string) => {
    dispatch(setSelectedGroupId(groupId));
    navigate(`/${groupId}/channels`);
  };

  // Right-click a group to open the group context menu
  const handleGroupContextMenu = (
    e: React.MouseEvent,
    groupId: string
  ) => {
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

  // Add group button handlers
  const handleCreateGroup = () => setCreateGroupModalOpen(true);
  const handleJoinGroup = () => setJoinGroupModalOpen(true);


  const handleContextMenuAction = (action: string, groupId: string) => {
    switch (action) {
      case "view":
        console.log(`View details for group ${groupId}`);
        break;
      case "edit":
        console.log(`Edit group ${groupId}`);
        break;
      case "delete":
        setIsDeleteGroupDialogOpen(true); // open "delete group" modal
        break;
      case "create-channel":
        setIsChannelDialogOpen(true); // open "create channel" dialog
        break;
      case "leave":
        setIsLeaveGroupDialogOpen(true); // open "leave group" modal
        break;
      default:
        break;
    }
    // Always close the context menu
    handleCloseContextMenu();
  };

  // (Example) confirm delete group
  const handleDeleteGroup = (groupName: string) => {
    console.log(`Deleting group: ${groupName}`);
    // Add your actual delete logic or thunk here
  };

  // (Example) confirm leave group
  const handleLeaveGroup = (groupName: string) => {
    console.log(`Leaving group: ${groupName}`);
    // Add your actual leave logic or thunk here
  };

  // -------------------------
  // Conditional rendering
  // -------------------------
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


  const groupInContext = groupContextMenu.groupId
    ? joinedGroups.find((g) => g._id === groupContextMenu.groupId)
    : null;

  return (
    <div className="w-20 bg-dark-1 h-full p-3 flex flex-col items-center overflow-hidden">
      {/* Logo: reset selection if clicked */}
      <SidebarLogo onClick={() => dispatch(setSelectedGroupId(null))} />

      <SidebarDivider />

      {/* 
        Presentational component: 
        Just lists groups & calls our handler for clicks/context.
      */}
      <Groups
        joinedGroups={joinedGroups}
        selectedGroupId={selectedGroupId || ""}
        onGroupClick={handleGroupClick}
        onGroupContextMenu={(e, group) => handleGroupContextMenu(e, group._id)}
        onCloseContextMenu={handleCloseContextMenu}
      />

      {/* If the user right-clicked a group, show the context menu */}
      {groupContextMenu.isOpen && groupInContext && (
        <GroupContextMenu
          group={groupInContext}
          position={groupContextMenu.position}
          onClose={handleCloseContextMenu}
          onAction={(action) => handleContextMenuAction(action, groupInContext._id)}
        />
      )}

      <SidebarDivider />

      {/* Add Group button + context menu (if needed) */}
      <AddGroupButton
        onClick={handleCreateGroup}
        onContextMenu={(e) => {
          e.preventDefault();
          // In your old code, you had a separate context menu for this
          // If you still want that, dispatch openContextMenu or some other logic
          console.log("Right-click on AddGroupButton");
        }}
        title="Add a Group"
      />

      <SidebarDivider />

      {/* 
        Central modals manager for Create/Join Group, 
        or you can do it inline 
      */}
      <ModalsManager
        isJoinGroupModalOpen={isJoinGroupModalOpen}
        closeJoinGroupModal={() => setJoinGroupModalOpen(false)}
        isCreateGroupModalOpen={isCreateGroupModalOpen}
        closeCreateGroupModal={() => setCreateGroupModalOpen(false)}
        // If you still have a "View Group Details" flow, you can incorporate it here
        isViewGroupDetailsModalOpen={false}
        closeViewGroupDetailsModal={() => {}}
      />

      {/* Dialog for creating a channel */}
      {isChannelDialogOpen && (
        <CreateChannelDialog
          isOpen={isChannelDialogOpen}
          setIsOpen={setIsChannelDialogOpen}
        />
      )}

      {/* Dialog for deleting a group */}
      {isDeleteGroupDialogOpen && (
        <DeleteGroupDialog
          onDelete={(groupName: string) => handleDeleteGroup(groupName)}
          isOpen={isDeleteGroupDialogOpen}
          setIsOpen={setIsDeleteGroupDialogOpen}
        />
      )}

      {/* Dialog for leaving a group */}
      {isLeaveGroupDialogOpen && (
        <LeaveGroupDialog
          onLeave={(groupName: string) => handleLeaveGroup(groupName)}
          isOpen={isLeaveGroupDialogOpen}
          setIsOpen={setIsLeaveGroupDialogOpen}
        />
      )}
    </div>
  );
};

export default Sidebar;
