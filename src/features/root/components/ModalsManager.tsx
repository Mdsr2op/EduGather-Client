import React from "react";
import JoinGroupDialog from "../groups/dialogs/JoinGroupDialog";
import CreateGroupDialog from "../groups/dialogs/CreateGroupDialog";


type ModalsManagerProps = {
  isJoinGroupModalOpen: boolean;
  closeJoinGroupModal: () => void;
  isCreateGroupModalOpen: boolean;
  closeCreateGroupModal: () => void;
  isViewGroupDetailsModalOpen: boolean;
  closeViewGroupDetailsModal: () => void;
  isCreateChannelModalOpen?: boolean;
  closeCreateChannelModal?: () => void;
  isDeleteChannelDialogOpen?: boolean;
  setIsDeleteChannelDialogOpen?: (isOpen: boolean) => void;
};

const ModalsManager: React.FC<ModalsManagerProps> = ({
  isJoinGroupModalOpen,
  closeJoinGroupModal,
  isCreateGroupModalOpen,
  closeCreateGroupModal,
  isViewGroupDetailsModalOpen,
  closeViewGroupDetailsModal,
}) => {
  const exampleGroupDetails = {
    channelName: "Awesome Group",
    description: "This is an awesome group for amazing people.",
    members: ["Alice", "Bob", "Charlie", "Diana"],
    createdBy: "AdminUser",
    createdAt: "January 1, 2024",
    groupAvatar: "https://via.placeholder.com/150",
  };

  return (
    <>
      <JoinGroupDialog
        isOpen={isJoinGroupModalOpen}
        onClose={closeJoinGroupModal}
      />
      <CreateGroupDialog
        isOpen={isCreateGroupModalOpen}
        onClose={closeCreateGroupModal}
      />
      <ViewGroupDetails
        isOpen={isViewGroupDetailsModalOpen}
        onClose={closeViewGroupDetailsModal}
        groupDetails={exampleGroupDetails}
      />
    </>
  );
};

export default ModalsManager;
