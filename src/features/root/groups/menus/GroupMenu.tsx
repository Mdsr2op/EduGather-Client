// GroupMenu.tsx
import React, { useRef, useEffect } from 'react';
import { FaPlus, FaUsers } from 'react-icons/fa';
import GroupMenuItem from '../components/GroupMenuItem';


type GroupMenuProps = {
  position: { x: number; y: number };
  isVisible: boolean;
  onClose: () => void;
  onCreateGroup: () => void;
  onJoinGroup: () => void;
};

const GroupMenu: React.FC<GroupMenuProps> = ({
  position,
  isVisible,
  onClose,
  onCreateGroup,
  onJoinGroup,
}) => {
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      onClose();
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

  return (
    <div
      ref={menuRef}
      className="absolute bg-[rgba(31,31,34,0.9)] text-white rounded-md shadow-lg z-50"
      style={{ top: position.y, left: position.x }}
    >
      <ul className="py-1">
        <GroupMenuItem
          icon={FaPlus}
          label="Create a Group"
          onClick={() => {
            onCreateGroup();
            onClose();
          }}
        />
        <GroupMenuItem
          icon={FaUsers}
          label="Join a Group"
          onClick={() => {
            onJoinGroup();
            onClose();
          }}
        />
      </ul>
    </div>
  );
};

export default GroupMenu;
