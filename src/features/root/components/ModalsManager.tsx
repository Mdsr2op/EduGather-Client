import React from "react";
import CreateGroupDialog from "../groups/dialogs/CreateGroupDialog";
import JoinGroupDialog from "../groups/dialogs/JoinGroupDialog";
import ViewGroupDetails from "../groups/dialogs/ViewGroupDetails";


type ModalsManagerProps = {
  isJoinGroupModalOpen: boolean;
  closeJoinGroupModal: () => void;
  isCreateGroupModalOpen: boolean;
  closeCreateGroupModal: () => void;
  isViewGroupDetailsModalOpen: boolean;
  closeViewGroupDetailsModal: () => void;


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
  isViewGroupDetailsModalOpen,
  closeViewGroupDetailsModal,
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

      {/* Dialog for "View Group Details" */}
        <ViewGroupDetails
          isOpen={isViewGroupDetailsModalOpen}
          onClose={closeViewGroupDetailsModal}
        />
    </>
  );
};

export default ModalsManager;
