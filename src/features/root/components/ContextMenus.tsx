import React from "react";
import GroupMenu from "../groups/menus/GroupMenu";
import SidebarGroupMenu from "../groups/components/GroupContextMenu";
import { UserJoinedGroups } from "../groups/slices/groupSlice";

interface ContextMenusProps {
  contextMenu: {
    position: { x: number; y: number };
    visible: boolean;
  };
  closeContextMenu: () => void;
  handleCreateGroup: () => void;
  handleJoinGroup: () => void;
  groupMenu: {
    group: UserJoinedGroups | null; 
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
      {groupMenu?.group && (
        <SidebarGroupMenu
          group={groupMenu.group}
          position={groupMenu.position}
          onClose={closeGroupMenu}
          onAction={(action) => {
            switch(action) {
              case 'view':
                navigateToGroupDetails();
                break;
              case 'edit':
                handleGroupAction("edit");
                break;
              case 'delete':
                handleGroupAction("delete");
                break;
              case 'create-channel':
                handleGroupAction("createChannel");
                break;
              case 'leave':
                handleGroupAction("leave");
                break;
            }
          }}
        />
      )}
    </>
  );
};

export default ContextMenus;
