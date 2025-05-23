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
import { useDeleteChannelMutation } from "../slices/channelApiSlice";
import { Channel } from "../slices/channelSlice";
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";

type DeleteChannelDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  channel: Channel;
};

const DeleteChannelDialog: React.FC<DeleteChannelDialogProps> = ({
  isOpen,
  setIsOpen,
  channel,
}) => {
  const { theme } = useTheme();
  const [confirmationText, setConfirmationText] = useState("");
  const [deleteChannel, { isLoading }] = useDeleteChannelMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    setConfirmationText("");
    setErrorMessage(null);
  };

  const handleDelete = async () => {
    if (!channel.groupId) {
      setErrorMessage("Missing group ID. Cannot delete channel.");
      return;
    }
    
    setErrorMessage(null);
    try {
      await deleteChannel({ 
        groupId: channel.groupId, 
        channelId: channel._id 
      }).unwrap();
      toast.success(`Channel "${channel.channelName}" deleted successfully`);
      handleClose();
    } catch (err: any) {
      console.error("Failed to delete channel:", err);
      setErrorMessage(err?.data?.message || "Failed to delete channel. Please try again.");
    }
  };

  const isConfirmEnabled = confirmationText === channel.channelName;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-md w-full p-6 rounded-lg shadow-lg border-none ${
        theme === 'dark'
          ? 'bg-dark-4 text-light-1'
          : 'bg-light-bg-2 text-light-text-1'
      }`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Delete Channel</DialogTitle>
          <DialogDescription className={`text-sm ${
            theme === 'dark' ? 'text-light-4' : 'text-light-text-3'
          }`}>
            Are you sure you want to delete the channel "<b>{channel.channelName}</b>"? This action cannot be undone.
            <br />
            To confirm, type the channel name below:
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className={`px-3 py-2 rounded-lg text-sm mt-2 ${
            theme === 'dark'
              ? 'bg-red-900/30 border border-red-800 text-red-200'
              : 'bg-red-100 border border-red-200 text-red-600'
          }`}>
            {errorMessage}
          </div>
        )}

        <Input
          type="text"
          className={`mt-4 w-full rounded-xl ${
            theme === 'dark'
              ? 'bg-dark-3 border-dark-5 text-light-1 placeholder-light-3'
              : 'bg-light-bg-1 border-light-bg-3 text-light-text-1 placeholder-light-text-3'
          }`}
          placeholder="Type the channel name to confirm"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
          disabled={isLoading}
          autoFocus
        />

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              className={`rounded-full ${
                theme === 'dark'
                  ? 'border-dark-5 text-light-1 hover:bg-dark-5'
                  : 'border-light-bg-3 text-light-text-1 hover:bg-light-bg-3'
              }`} 
              disabled={isLoading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className={`bg-[#FF4C4C] text-white rounded-full shadow-md hover:bg-opacity-80 ${
              isConfirmEnabled ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleDelete}
            disabled={!isConfirmEnabled || isLoading}
          >
            {isLoading ? "Deleting..." : `Delete "${channel.channelName}"`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelDialog;
