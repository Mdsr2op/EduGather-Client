import { useState } from "react";
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
        className={`p-2 rounded-full transition-all duration-200 ${
          openDialog 
            ? 'bg-primary-500/20 text-primary-500' 
            : 'hover:bg-light-bg-2 dark:hover:bg-dark-4'
        }`}
        onClick={handleOpenDialog}
        title="Channel Options"
      >
        <FiMoreVertical size={18} className="text-light-3" />
      </button>

      {openDialog && <OptionsDialog onClose={handleCloseDialog} />}
    </div>
  );
};

export default OptionsButton;
