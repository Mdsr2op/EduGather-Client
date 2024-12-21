import React from "react";
import GroupMenu from "../groups/menus/GroupMenu";
import SidebarGroupMenu from "../groups/components/SideBarGroupMenu";

type Group = {
  id: number;
  name: string;
  image: string;
  createdBy: number;
  currentUserId: number;
};
interface ContextMenusProps {
  contextMenu: {
    position: { x: number; y: number };
    visible: boolean;
  };
  closeContextMenu: () => void;
  handleCreateGroup: () => void;
  handleJoinGroup: () => void;
  groupMenu: {
    group: Group | null; // Replace `any` with the appropriate type for `group` if available
    position: { x: number; y: number };
    visible: boolean;
  };
  closeGroupMenu: () => void;
  handleGroupAction: (action: string) => void;
  navigateToGroupDetails: () => void;
}

const ContextMenus: React.FC<ContextMenusProps> = ({
  contextMenu,
  closeContextMenu,
  handleCreateGroup,
  handleJoinGroup,
  groupMenu,
  closeGroupMenu,
  handleGroupAction,
  navigateToGroupDetails,
}) => {
  return (
    <>
      {/* Group Menu */}
      <GroupMenu
        position={contextMenu.position}
        isVisible={contextMenu.visible}
        onClose={closeContextMenu}
        onCreateGroup={handleCreateGroup}
        onJoinGroup={handleJoinGroup}
      />

      {/* Sidebar Group Menu */}
      <SidebarGroupMenu
        group={groupMenu?.group}
        position={groupMenu?.position}
        isVisible={groupMenu?.visible}
        onViewDetails={navigateToGroupDetails}
        onEditDetails={() => handleGroupAction("edit")}
        onDeleteGroup={() => handleGroupAction("delete")}
        onCreateChannel={() => handleGroupAction("createChannel")}
        onLeaveGroup={() => handleGroupAction("leave")}
        onCloseMenu={closeGroupMenu}
      />
    </>
  );
};

export default ContextMenus;
