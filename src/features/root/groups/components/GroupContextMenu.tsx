// GroupContextMenu.tsx

import React, { useEffect, useRef } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import MenuItem from "../../components/MenuItem";
import { UserJoinedGroups } from "../slices/groupSlice";
import { useSelector } from "react-redux";

type GroupContextMenuProps = {
  group: UserJoinedGroups;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: 'view' | 'edit' | 'delete' | 'create-channel' | 'leave' | 'invite') => void;
};

const GroupContextMenu: React.FC<GroupContextMenuProps> = ({
  group,
  position,
  onClose,
  onAction,
}) => {
  const currentUserId = useSelector((state: any) => state.auth.user._id);

  const menuRef = useRef<HTMLDivElement>(null);

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

  // Adjust position to ensure menu stays within viewport
  useEffect(() => {
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Check if menu extends beyond right edge
      if (position.x + menuRect.width > viewportWidth) {
        menuRef.current.style.left = `${viewportWidth - menuRect.width - 10}px`;
      }
      
      // Check if menu extends beyond bottom edge
      if (position.y + menuRect.height > viewportHeight) {
        menuRef.current.style.top = `${viewportHeight - menuRect.height - 10}px`;
      }
    }
  }, [position]);

  const isGroupOwner = group.createdBy._id === currentUserId;
  
  // Find current user's role in the group
  const currentUserMember = group.members.find(member => member._id === currentUserId);
  const isAdminOrModerator = isGroupOwner || 
    (currentUserMember?.role === 'admin' || currentUserMember?.role === 'moderator');

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-dark-2 text-light-1 rounded-xl shadow-lg border border-dark-4 backdrop-blur-lg overflow-hidden"
      style={{ 
        top: position.y, 
        left: position.x, 
        width: "13rem",
        animation: "fadeIn 0.15s ease-in-out"
      }}
    >
      <div className="px-3 py-2 border-b border-dark-4 bg-dark-3">
        <h3 className="text-sm font-medium truncate">{group.name}</h3>
      </div>
      <ul className="py-1">
        <MenuItem
          icon={FaEye}
          label="View Group Details"
          onClick={() => onAction("view")}
        />
        {isGroupOwner && (
          <MenuItem
            icon={FaEdit}
            label="Edit Group Details"
            onClick={() => onAction("edit")}
          />
        )}
        {isAdminOrModerator && (
          <>
            <MenuItem
              icon={FaUserPlus}
              label="Invite to Group"
              onClick={() => onAction("invite")}
            />
            <MenuItem
              icon={FaPlus}
              label="Create Channel"
              onClick={() => onAction("create-channel")}
            />
          </>
        )}
        {isGroupOwner && (
          <MenuItem
            icon={FaTrash}
            label="Delete Group"
            onClick={() => onAction("delete")}
            isDanger
          />
        )}
        <MenuItem
          icon={FaSignOutAlt}
          label="Leave Group"
          onClick={() => onAction("leave")}
          isDanger
        />
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

export default GroupContextMenu;
