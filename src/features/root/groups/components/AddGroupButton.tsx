import React from "react";
import { FaPlus } from "react-icons/fa";

type AddGroupButtonProps = {
  onClick: () => void;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  title: string;
};

const AddGroupButton: React.FC<AddGroupButtonProps> = ({ onClick, onContextMenu, title }) => (
  <div
    className="mt-2 mb-2 cursor-pointer text-primary bg-dark-4 p-3 rounded-lg hover:bg-dark-5 hover:shadow-lg transition duration-200 ease-in-out"
    onClick={onClick}
    onContextMenu={onContextMenu}
    title={title}
  >
    <FaPlus size={20} />
  </div>
);

export default AddGroupButton;
