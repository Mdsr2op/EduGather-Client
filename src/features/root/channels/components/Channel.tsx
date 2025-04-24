// Channel.tsx
import React from "react";
import { FiHash } from "react-icons/fi";

interface ChannelProps {
  id: string;
  name: string;
  isSelected: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent<HTMLLIElement>, channelId: string) => void; // Updated signature
}

const Channel: React.FC<ChannelProps> = ({
  id,
  name,
  isSelected,
  onClick,
  onContextMenu,
}) => {
  const handleContextMenu = (e: React.MouseEvent<HTMLLIElement>) => {
    onContextMenu(e, id); // Ensure MouseEvent is passed as the first argument
  };

  return (
    <li
      className={`px-4 py-3 cursor-pointer rounded-xl flex items-center gap-3 transition-all duration-200 ${
        isSelected 
          ? "bg-dark-4 text-primary-500 shadow-md" 
          : "text-light-2 hover:bg-dark-3 hover:text-light-1"
      }`}
      onClick={onClick}
      onContextMenu={handleContextMenu} // Use the wrapped handler
    >
      <FiHash className={`w-5 h-5 ${isSelected ? "text-primary-500" : "text-light-3"}`} />
      <span className={`text-base truncate ${isSelected ? "font-medium" : ""}`}>{name}</span>
    </li>
  );
};

export default Channel;
