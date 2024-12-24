import React from "react";
import JoinGroupDialog from "../groups/dialogs/JoinGroupDialog";
import CreateGroupDialog from "../groups/dialogs/CreateGroupDialog";
import ViewGroupDetails from "../groups/dialogs/ViewGroupDetails";
import { UserJoinedGroups } from "../groups/slices/groupSlice";


type ModalsManagerProps = {
  isJoinGroupModalOpen: boolean;
  closeJoinGroupModal: () => void;
  isCreateGroupModalOpen: boolean;
  closeCreateGroupModal: () => void;
  isViewGroupDetailsModalOpen: boolean;
  closeViewGroupDetailsModal: () => void;

  // If we want to pass the actual group data for "view details":
  viewGroupDetailsData?: UserJoinedGroups | null;

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
  viewGroupDetailsData,
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
      {viewGroupDetailsData && (
        <ViewGroupDetails
          isOpen={isViewGroupDetailsModalOpen}
          onClose={closeViewGroupDetailsModal}
          groupDetails={{
            // If your `ViewGroupDetails` still calls it `channelName`, we map group.name -> channelName
            channelName: viewGroupDetailsData.name,
            description: viewGroupDetailsData.description,
            // If `GroupInfo` requires an array of strings for `members`, just map them:
            members: viewGroupDetailsData.members?.map(
              (m) => m.userId?.username || "Unknown"
            ),
            createdBy: viewGroupDetailsData.createdBy,
            createdAt: viewGroupDetailsData.createdAt,
            groupAvatar: viewGroupDetailsData.avatar || "",
          }}
        />
      )}
    </>
  );
};

export default ModalsManager;
