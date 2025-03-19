import React from "react";
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
import { FiX } from "react-icons/fi";
import { Channel } from "../slices/channelSlice";

type ViewChannelDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel;
};

const ViewChannelDetails: React.FC<ViewChannelDetailsProps> = ({
  isOpen,
  onClose,
  channel,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none overflow-y-auto max-h-[80vh] custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Channel Details
          </DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            View information about this channel.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-light-1">
              {channel.channelName}
            </h2>
            <p className="text-light-3 text-sm">Channel ID: {channel._id}</p>
          </div>

          <div>
            <p className="text-light-2">
              {channel.description || "No description provided."}
            </p>
          </div>
        </div>

        <DialogFooter className="flex justify-end pt-4">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-dark-5 text-light-1 hover:bg-dark-5 rounded-full"
              onClick={onClose}
            >
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewChannelDetails;
