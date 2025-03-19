import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDeleteGroupMutation } from "../slices/groupApiSlice";

type DeleteGroupDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groupName?: string;
  groupId?: string;
};

const DeleteGroupDialog: React.FC<DeleteGroupDialogProps> = ({
  isOpen,
  setIsOpen,
  groupName = "Awesome",
  groupId,
}) => {
  const [confirmationText, setConfirmationText] = useState<string>("");
  const [deleteGroup] = useDeleteGroupMutation();

  const closeDialog = () => {
    setIsOpen(false);
    setConfirmationText("");
  };

  const handleDelete = async () => {
    if (!groupId) return;
    try {
      await deleteGroup(groupId).unwrap();
      closeDialog();
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  };

  const isConfirmEnabled = confirmationText === groupName;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Delete {groupName}</DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            Are you sure you want to delete the group '{groupName}'? This action cannot be undone. To confirm, type the group name below.
          </DialogDescription>
        </DialogHeader>
        
        <Input
          type="text"
          placeholder="Type group name to confirm"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className="mt-4 w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
        />

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="border-dark-5 text-light-1 hover:bg-dark-5 rounded-full">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            disabled={!isConfirmEnabled}
            className={`bg-[#FF4C4C] hover:bg-opacity-80 text-white rounded-full shadow-md ${isConfirmEnabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
          >
            Delete '{groupName}'
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteGroupDialog;
