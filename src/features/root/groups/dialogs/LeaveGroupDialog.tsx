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
import { useLeaveGroupMutation } from "../slices/groupApiSlice";

interface LeaveGroupDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groupId: string | null;
  groupName?: string;
}

const LeaveGroupDialog: React.FC<LeaveGroupDialogProps> = ({
  isOpen,
  setIsOpen,
  groupId,
  groupName = "Awesome",
}) => {
  const [leaveGroup, { isLoading, error }] = useLeaveGroupMutation();
  const [localError, setLocalError] = useState<string | null>(null);

  const closeDialog = () => {
    setIsOpen(false);
    setLocalError(null);
  };

  const handleLeave = async () => {
    try {
      if (!groupId) return;
      await leaveGroup({ groupId }).unwrap();
      closeDialog();
    } catch (err) {
      setLocalError("Failed to leave the group. Please try again.");
    }
  };

  const errorMessage = error
    ? (error as any)?.data?.message || (error as any)?.error || "An error occurred"
    : localError;

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-lg w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Leave {groupName}
          </DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            Are you sure you want to leave the group "{groupName}"? You will no longer receive messages from this group.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="mt-4 p-2 bg-red-500 bg-opacity-20 rounded">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-dark-5 text-light-1 hover:bg-dark-5 rounded-full"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleLeave}
            className="bg-[#FF4C4C] hover:bg-[#e74e4e]   text-white rounded-full shadow-md"
            disabled={isLoading}
          >
            {isLoading ? "Leaving..." : `Leave '${groupName}'`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveGroupDialog;
