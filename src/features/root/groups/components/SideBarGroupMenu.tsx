// SidebarGroupMenu.tsx
import React, { useRef, useEffect } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSignOutAlt } from 'react-icons/fa'; // Example icons
import MenuItem from "../../components/MenuItem";
import { Group } from "./Groups";

type SidebarGroupMenuProps = {
  group: Group| null
  position: { x: number; y: number };
  isVisible: boolean;
  onViewDetails: () => void;
  onEditDetails: () => void;
  onDeleteGroup: () => void;
  onCreateChannel: () => void;
  onLeaveGroup: () => void;
  onCloseMenu: () => void;
};

const SidebarGroupMenu: React.FC<SidebarGroupMenuProps> = ({
  group,
  position,
  isVisible,
  onViewDetails,
  onEditDetails,
  onDeleteGroup,
  onCreateChannel,
  onLeaveGroup,
  onCloseMenu,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      onCloseMenu();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const handleClick = (action: () => void) => {
    action();
    onCloseMenu();
  };

  return (
    <div
      ref={menuRef}
      className="absolute z-50 bg-[rgba(31,31,34,0.9)] text-white rounded-md shadow-lg"
      style={{ top: position.y, left: position.x, width: '12rem' }}
    >
      <ul className="py-1">
        <MenuItem
          icon={FaEye}
          label="View Group Details"
          onClick={() => handleClick(onViewDetails)}
        />
        {group?.createdBy === group?.currentUserId && (
          <>
            <MenuItem
              icon={FaEdit}
              label="Edit Group Details"
              onClick={() => handleClick(onEditDetails)}
            />
            <MenuItem
              icon={FaTrash}
              label="Delete Group"
              onClick={() => handleClick(onDeleteGroup)}
              isDanger
            />
          </>
        )}
        <MenuItem
          icon={FaPlus}
          label="Create Channel"
          onClick={() => handleClick(onCreateChannel)}
        />
        <MenuItem
          icon={FaSignOutAlt}
          label="Leave Group"
          onClick={() => handleClick(onLeaveGroup)}
          isDanger
        />
      </ul>
    </div>
  );
};

export default SidebarGroupMenu;
