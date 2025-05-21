import React from "react";
import { FaPlus } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

type AddGroupButtonProps = {
  onClick: () => void;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  title: string;
};

const AddGroupButton: React.FC<AddGroupButtonProps> = ({ onClick, onContextMenu, title }) => {
  const { theme } = useTheme();
  
  return (
    <div
      className={`mt-2 mb-2 cursor-pointer ${theme === 'dark' ? 'text-primary bg-dark-4 hover:bg-dark-5' : 'text-primary-600 bg-light-bg-4 hover:bg-light-bg-5'} p-3 rounded-lg hover:shadow-lg transition duration-200 ease-in-out`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      title={title}
    >
      <FaPlus size={20} />
    </div>
  );
};

export default AddGroupButton;
