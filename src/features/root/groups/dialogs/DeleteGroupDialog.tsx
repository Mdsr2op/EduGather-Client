// DeleteGroupDialog.tsx
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useDeleteGroupMutation } from "../slices/groupApiSlice";

type DeleteGroupDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groupName?: string;
  groupId?: string; // add this so we know which group to delete
  onDelete: (groupName: string) => void;
};

const DeleteGroupDialog: React.FC<DeleteGroupDialogProps> = ({
  isOpen,
  setIsOpen,
  groupName = "Awesome",
  groupId,
  onDelete,
}) => {
  const [confirmationText, setConfirmationText] = useState<string>('');
  const [deleteGroup] = useDeleteGroupMutation();

  const closeDialog = () => {
    setIsOpen(false);
    setConfirmationText('');
  };

  const handleDelete = async () => {
    if (!groupId) {
      return;
    }
    try {
      await deleteGroup(groupId).unwrap();
      onDelete(groupName);
      closeDialog();
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  const isConfirmEnabled = confirmationText === groupName;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeDialog}>
        {/* ... same UI code as you have ... */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 bg-dark-6 text-light-1 rounded-md hover:bg-opacity-80"
            onClick={closeDialog}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-4 py-2 bg-[#FF4C4C] text-white rounded-md hover:bg-opacity-80 ${
              isConfirmEnabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={handleDelete}
            disabled={!isConfirmEnabled}
          >
            Delete '{groupName}'
          </button>
        </div>

      </Dialog>
    </Transition.Root>
  );
};

export default DeleteGroupDialog;
