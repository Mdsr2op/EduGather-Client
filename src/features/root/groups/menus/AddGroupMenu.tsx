"use client";

import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import JoinGroupDialog from "../dialogs/JoinGroupDialog";

interface AddGroupMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClose: () => void;
  position: { x: number; y: number };
  setIsCreateGroupDialog: Dispatch<SetStateAction<boolean>>;
  isJoinGroupDialogOpen: boolean;
  setIsJoinGroupDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const AddGroupMenu: React.FC<AddGroupMenuProps> = ({
  isOpen,
  setIsOpen,
  onClose,
  position,
  setIsCreateGroupDialog,
  isJoinGroupDialogOpen,
  setIsJoinGroupDialogOpen,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Track where to place the menu after boundary checks
  const [calculatedPosition, setCalculatedPosition] = React.useState<{
    top: number;
    left: number;
  }>({ top: position.y, left: position.x });

  // Close menu if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Don’t render if not open
  if (!isOpen) {
    return null;
  }

  // Menu sizing (rough approximation)
  const menuWidth = 192; // e.g. Tailwind w-48 => 12rem => 192px
  const menuHeight = 80; // approximate height for two items

  // Check if we need to adjust for viewport boundaries
  useEffect(() => {
    const handlePosition = () => {
      let top = position.y;
      let left = position.x;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // If menu would overflow the right edge
      if (left + menuWidth > viewportWidth) {
        left = viewportWidth - menuWidth - 10; // 10px padding
      }

      // If menu would overflow the bottom edge
      if (top + menuHeight > viewportHeight) {
        top = viewportHeight - menuHeight - 10;
      }

      setCalculatedPosition({ top, left });
    };

    handlePosition();
  }, [position.x, position.y]);

  // Inline style for absolute positioning
  const menuStyle: React.CSSProperties = {
    position: "fixed",
    top: calculatedPosition.top,
    left: calculatedPosition.left,
    zIndex: 1000, // ensure it’s above other elements
  };

  return createPortal(
    <>
      <div
        ref={menuRef}
        style={menuStyle}
        className="w-48 bg-dark-2 text-white shadow-lg rounded-xl p-2 flex flex-col"
      >
        <button
          onClick={() => {
            setIsCreateGroupDialog(true);
            setIsOpen(false);
          }}
          className="text-left py-2 px-4 hover:bg-dark-5 rounded-xl"
        >
          Create Group
        </button>
        <button
          onClick={() => {
            setIsJoinGroupDialogOpen(true);
            setIsOpen(true); // Open the Join Group dialog
          }}
          className="text-left py-2 px-4 hover:bg-dark-5 rounded-xl"
        >
          Join Group
        </button>
      </div>

      {/* Render JoinGroupDialog */}
      <JoinGroupDialog
        isOpen={isJoinGroupDialogOpen}
        setIsOpen={setIsJoinGroupDialogOpen}
        onClose={() => {
          setIsJoinGroupDialogOpen(false);
        }}
      />
    </>,
    document.body
  );
};

export default AddGroupMenu;
