// AddGroupMenu.tsx
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface AddGroupMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onClose: () => void;
  position: { x: number; y: number };
  setIsCreateGroupDialog: Dispatch<SetStateAction<boolean>>;
}

const AddGroupMenu: React.FC<AddGroupMenuProps> = ({
  isOpen,
  setIsOpen,
  onClose,
  position,
  setIsCreateGroupDialog,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [calculatedPosition, setCalculatedPosition] = React.useState<{
    top: number;
    left: number;
  }>({ top: position.y, left: position.x });

  // Close menu if user clicks outside
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

  if (!isOpen) {
    return null;
  }

  // Calculate menu position with boundary checks
  const menuWidth = 192; // 48 * 4 (Tailwind's width-48 is 12rem = 192px)
  const menuHeight = 80; // Approximate height based on content

  useEffect(() => {
    const handlePosition = () => {
      let top = position.y;
      let left = position.x;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Adjust if menu overflows right edge
      if (left + menuWidth > viewportWidth) {
        left = viewportWidth - menuWidth - 10; // 10px padding
      }

      // Adjust if menu overflows bottom edge
      if (top + menuHeight > viewportHeight) {
        top = viewportHeight - menuHeight - 10; // 10px padding
      }

      setCalculatedPosition({ top, left });
    };

    handlePosition();
  }, [position.x, position.y]);

  // Styles for positioning
  const menuStyle: React.CSSProperties = {
    position: "fixed",
    top: calculatedPosition.top,
    left: calculatedPosition.left,
    zIndex: 1000,
  };

  return createPortal(
    <div
      ref={menuRef}
      style={menuStyle}
      className="w-48 bg-dark-2 text-white 
               shadow-lg rounded-xl p-2 flex flex-col"
    >
      <button
        onClick={() => {
          setIsCreateGroupDialog((prev) => !prev);
        }}
        className="text-left py-2 px-4 hover:bg-dark-5 rounded-xl"
      >
        Create Group
      </button>
      <button
        onClick={() => {
          console.log("Join Group clicked");
          setIsOpen(false);
          onClose();
          // Implement join group functionality here
        }}
        className="text-left py-2 px-4 hover:bg-dark-5 rounded-xl"
      >
        Join Group
      </button>
    </div>,
    document.body
  );
};

export default AddGroupMenu;
