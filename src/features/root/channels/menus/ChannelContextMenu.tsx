import React, { useEffect, useRef } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
// Import your type(s) from the slice
import { Channel } from "../slices/channelSlice";

type ChannelContextMenuProps = {
  channel: Channel;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: string) => void;
};

const ChannelContextMenu: React.FC<ChannelContextMenuProps> = ({
  channel,
  position,
  onClose,
  onAction,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-[rgba(31,31,34,0.9)] text-white rounded-md shadow-lg"
      style={{
        top: position.y,
        left: position.x,
        width: "12rem",
      }}
    >
      <ul className="py-1">
        {/* View Channel */}
        <li
          className="px-4 py-2 hover:bg-dark-2 flex items-center cursor-pointer"
          onClick={() => onAction("view")}
        >
          <FaEye className="mr-2" />
          View Channel
        </li>

        {/* Edit Channel */}
        <li
          className="px-4 py-2 hover:bg-dark-2 flex items-center cursor-pointer"
          onClick={() => onAction("edit")}
        >
          <FaEdit className="mr-2" />
          Edit Channel
        </li>

        {/* Delete Channel */}
        <li
          className="px-4 py-2 hover:bg-dark-2 flex items-center cursor-pointer text-red-500"
          onClick={() => onAction("delete")}
        >
          <FaTrash className="mr-2" />
          Delete Channel
        </li>
      </ul>
    </div>
  );
};

export default ChannelContextMenu;
