import React, { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import OptionsDialog from "./OptionsDialog";

const OptionsButton = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="relative">
      <button
        className="hover:text-primary-500"
        onClick={handleOpenDialog}
        aria-label="Open Options Dialog"
      >
        <FiMoreVertical size={20} className="text-light-3" />
      </button>

      {openDialog && <OptionsDialog onClose={handleCloseDialog} />}
    </div>
  );
};

export default OptionsButton;
