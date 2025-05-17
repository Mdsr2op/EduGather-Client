// Channel.tsx
import React, { memo } from "react";
import { FiHash } from "react-icons/fi";

interface ChannelProps {
  id: string;
  name: string;
  isSelected: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent<HTMLLIElement>) => void;
}

const Channel: React.FC<ChannelProps> = ({
  name,
  isSelected,
  onClick,
  onContextMenu,
}) => {
  return (
    <li
      className={`px-4 py-3 cursor-pointer rounded-xl flex items-center gap-3 transition-all duration-200 ${
        isSelected 
          ? "bg-dark-4 text-primary-500 shadow-md" 
          : "text-light-2 hover:bg-dark-3 hover:text-light-1"
      }`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <FiHash className={`w-5 h-5 ${isSelected ? "text-primary-500" : "text-light-3"}`} />
      <span className={`text-base truncate ${isSelected ? "font-medium" : ""}`}>{name}</span>
    </li>
  );
};

// Use memo to prevent unnecessary rerenders
export default memo(Channel);
