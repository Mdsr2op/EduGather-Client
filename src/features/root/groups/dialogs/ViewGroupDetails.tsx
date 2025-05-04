// src/components/ViewGroupDetails.tsx

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import GroupInfo from '../components/GroupInfo';

type ViewGroupDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ViewGroupDetails: React.FC<ViewGroupDetailsProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-full p-6 bg-dark-3 text-light-1 rounded-lg shadow-lg border-none overflow-y-auto max-h-[80vh] custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Group Details
          </DialogTitle>
        </DialogHeader>
        
        {/* Group Details */}
        <GroupInfo />
      </DialogContent>
    </Dialog>
  );
};

export default ViewGroupDetails;
