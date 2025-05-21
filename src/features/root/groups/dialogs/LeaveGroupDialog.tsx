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
import { toast } from "react-hot-toast";
import { useLeaveGroupMutation } from "../slices/groupApiSlice";
import { useTheme } from "@/context/ThemeContext";

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
  const { theme } = useTheme();
  const [confirmationText, setConfirmationText] = useState<string>("");
  const [leaveGroup, { error }] = useLeaveGroupMutation();
  const [localError, setLocalError] = useState<string | null>(null);

  const closeDialog = () => {
    setIsOpen(false);
    setLocalError(null);
  };

  const handleLeave = async () => {
    try {
      if (!groupId) return;
      await leaveGroup({ groupId }).unwrap();
      toast.success(`Left ${groupName} successfully`, {
        position: "top-center"
      });
      closeDialog();
    } catch (err) {
      setLocalError("Failed to leave the group. Please try again.");
      toast.error("Failed to leave the group. Please try again.", {
        position: "top-center"
      });
    }
  };

  const errorMessage = error
    ? (error as any)?.data?.message || (error as any)?.error || "An error occurred"
    : localError;

  const isConfirmEnabled = confirmationText === groupName;

  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>
      <DialogContent className={`sm:max-w-lg w-full p-6 rounded-lg shadow-lg border-none ${
        theme === 'dark'
          ? 'bg-dark-4 text-light-1'
          : 'bg-light-bg-2 text-light-text-1'
      }`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Leave {groupName}</DialogTitle>
          <DialogDescription className={`text-sm ${
            theme === 'dark' ? 'text-light-4' : 'text-light-text-3'
          }`}>
            Are you sure you want to leave the group '{groupName}'? This action cannot be undone. To confirm, type the group name below.
          </DialogDescription>
        </DialogHeader>
        
        <Input
          type="text"
          placeholder="Type group name to confirm"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          className={`mt-4 w-full rounded-xl ${
            theme === 'dark'
              ? 'bg-dark-3 border-dark-5 text-light-1 placeholder-light-3'
              : 'bg-light-bg-1 border-light-bg-3 text-light-text-1 placeholder-light-text-3'
          } focus:ring-primary-500 focus:border-primary-500`}
        />

        {errorMessage && (
          <div className="mt-4 p-2 bg-red-500 bg-opacity-20 rounded">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              className={`rounded-full ${
                theme === 'dark'
                  ? 'border-dark-5 text-light-1 hover:bg-dark-5'
                  : 'border-light-bg-3 text-light-text-1 hover:bg-light-bg-3'
              }`}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleLeave}
            disabled={!isConfirmEnabled}
            className={`bg-[#FF4C4C] hover:bg-opacity-80 text-white rounded-full shadow-md ${
              isConfirmEnabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
            }`}
          >
            Leave '{groupName}'
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveGroupDialog;
