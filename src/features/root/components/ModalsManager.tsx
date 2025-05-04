import React from "react";
import CreateGroupDialog from "../groups/dialogs/CreateGroupDialog";
import JoinGroupDialog from "../groups/dialogs/JoinGroupDialog";

type ModalsManagerProps = {
  isJoinGroupModalOpen: boolean;
  closeJoinGroupModal: () => void;
  isCreateGroupModalOpen: boolean;
  closeCreateGroupModal: () => void;

  // The rest of your optional modals:
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
}) => {

  return (
    <>
      {/* Dialog for "Join Group" */}
      <JoinGroupDialog
        isOpen={isJoinGroupModalOpen}
        onClose={closeJoinGroupModal}
      />

      {/* Dialog for "Create Group" */}
      <CreateGroupDialog
        isOpen={isCreateGroupModalOpen}
        onClose={closeCreateGroupModal}
      />
    </>
  );
};

export default ModalsManager;
