// GroupContextMenu.tsx

import React, { useEffect, useRef } from "react";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSignOutAlt } from "react-icons/fa";
import MenuItem from "../../components/MenuItem";
import { UserJoinedGroups } from "../slices/groupSlice";

type GroupContextMenuProps = {
  group: UserJoinedGroups;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: string) => void; // 'view' | 'edit' | 'delete' | 'create-channel' | 'leave'
};

const GroupContextMenu: React.FC<GroupContextMenuProps> = ({
  group,
  position,
  onClose,
  onAction,
}) => {
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

  const isGroupOwner =
    group.createdBy ===
    group.members?.find((m) => m.userId?._id === group.createdBy)?.userId?._id;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-[rgba(31,31,34,0.9)] text-white rounded-md shadow-lg"
      style={{ top: position.y, left: position.x, width: "12rem" }}
    >
      <ul className="py-1">
        <MenuItem
          icon={FaEye}
          label="View Group Details"
          onClick={() => onAction("view")}
        />
        <MenuItem
          icon={FaEdit}
          label="Edit Group Details"
          onClick={() => onAction("edit")}
        />
        <MenuItem
          icon={FaTrash}
          label="Delete Group"
          onClick={() => onAction("delete")}
          isDanger
        />
        <MenuItem
          icon={FaPlus}
          label="Create Channel"
          onClick={() => onAction("create-channel")}
        />
        <MenuItem
          icon={FaSignOutAlt}
          label="Leave Group"
          onClick={() => onAction("leave")}
          isDanger
        />
      </ul>
    </div>
  );
};

export default GroupContextMenu;
