// Channel.tsx
import React from "react";

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
      className={`p-2 cursor-pointer rounded-md ${
        isSelected ? "bg-dark-5 text-primary-500" : "text-light-1 hover:bg-dark-5"
      }`}
      onClick={onClick}
      onContextMenu={handleContextMenu} // Use the wrapped handler
    >
      {name}
    </li>
  );
};

export default Channel;
