// ChannelContextMenu.tsx
import React, { useEffect, useRef } from "react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSignOutAlt,
} from "react-icons/fa";
import MenuItem from "../../components/MenuItem";

type Channel = {
  _id: string;
  channelName: string;
  // Add other relevant properties if needed
};

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

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose(); // Close the menu
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Determine if the user has permissions to edit/delete
  const isChannelOwner = true; // Replace with actual logic

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-[rgba(31,31,34,0.9)] text-white rounded-md shadow-lg"
      style={{ top: position.y, left: position.x, width: "12rem" }}
    >
      <ul className="py-1">
        <MenuItem
          icon={FaEye}
          label="View Channel Details"
          onClick={() => onAction("view")}
        />
        {isChannelOwner && (
          <>
            <MenuItem
              icon={FaEdit}
              label="Edit Channel"
              onClick={() => onAction("edit")}
            />
            <MenuItem
              icon={FaTrash}
              label="Delete Channel"
              onClick={() => onAction("delete")}
              isDanger={true}
            />
          </>
        )}
        {/* Add other menu items as needed */}
      </ul>
    </div>
  );
};

export default ChannelContextMenu;
