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
  const [confirmationText, setConfirmationText] = useState("");
  const [deleteChannel] = useDeleteChannelMutation();

  const handleClose = () => {
    setIsOpen(false);
    setConfirmationText("");
  };

  const handleDelete = async () => {
    if (!channel.groupId) return;
    try {
      await deleteChannel({ groupId: channel.groupId, channelId: channel._id }).unwrap();
      handleClose();
    } catch (error) {
      console.error("Failed to delete channel:", error);
    }
  };

  const isConfirmEnabled = confirmationText === channel.channelName;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Delete Channel</DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            Are you sure you want to delete the channel "<b>{channel.channelName}</b>"? This action cannot be undone.
            <br />
            To confirm, type the channel name below:
          </DialogDescription>
        </DialogHeader>

        <Input
          type="text"
          className="mt-4 w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 rounded-xl"
          placeholder="Type the channel name to confirm"
          value={confirmationText}
          onChange={(e) => setConfirmationText(e.target.value)}
        />

        <DialogFooter className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline" className="border-dark-5 text-light-1 hover:bg-dark-5 rounded-full">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className={`bg-[#FF4C4C] text-white rounded-full shadow-md hover:bg-opacity-80 ${
              isConfirmEnabled ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={handleDelete}
            disabled={!isConfirmEnabled}
          >
            Delete "{channel.channelName}"
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelDialog;
