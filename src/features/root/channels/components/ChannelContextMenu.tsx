// ChannelContextMenu.tsx

import React, { useEffect, useRef } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import MenuItem from "../../components/MenuItem";

type Channel = {
  _id: string;
  channelName: string;
};

type ChannelContextMenuProps = {
  channel: Channel;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: string) => void;  // "view" | "edit" | "delete"
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
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const isChannelOwner = true; // or some real logic

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
              isDanger
            />
          </>
        )}
      </ul>
    </div>
  );
};

export default ChannelContextMenu;
