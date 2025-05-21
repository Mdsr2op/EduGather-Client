// ChannelContextMenu.tsx
import React, { useEffect, useRef } from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import MenuItem from "../../components/MenuItem";
import { useTheme } from "../../../../context/ThemeContext";

type Channel = {
  _id: string;
  channelName: string;
};

type ChannelContextMenuProps = {
  channel: Channel;
  position: { x: number; y: number };
  canManageChannels: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
};

const ChannelContextMenu: React.FC<ChannelContextMenuProps> = ({
  channel,
  position,
  canManageChannels,
  onClose,
  onAction,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

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


  return (
    <div
      ref={menuRef}
      className={`fixed z-50 rounded-xl shadow-lg border backdrop-blur-lg overflow-hidden ${
        theme === 'dark' 
          ? 'bg-dark-2 text-light-1 border-dark-4' 
          : 'bg-light-bg-1 text-light-text-1 border-light-bg-4'
      }`}
      style={{ 
        top: position.y, 
        left: position.x, 
        width: "13rem",
        animation: "fadeIn 0.15s ease-in-out"
      }}
    >
      <div className={`px-3 py-2 border-b ${
        theme === 'dark' 
          ? 'border-dark-4 bg-dark-3' 
          : 'border-light-bg-4 bg-light-bg-2'
      }`}>
        <h3 className="text-sm font-medium truncate">{channel.channelName}</h3>
      </div>
      <ul className="py-1">
        <MenuItem
          icon={FiEye}
          label="View Channel Details"
          onClick={() => onAction("view")}
        />
        {canManageChannels && (
          <>
            <MenuItem
              icon={FiEdit2}
              label="Edit Channel"
              onClick={() => onAction("edit")}
            />
            <MenuItem
              icon={FiTrash2}
              label="Delete Channel"
              onClick={() => onAction("delete")}
              isDanger={true}
            />
          </>
        )}
      </ul>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
};

export default ChannelContextMenu;
