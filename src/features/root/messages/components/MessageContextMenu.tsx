import React, { useEffect, useRef } from "react";
import {
  FaEdit,
  FaTrash,
  FaReply,
  FaThumbtack,
  FaCopy,
  FaForward
} from "react-icons/fa";
import MenuItem from "../../components/MenuItem";
import { MessageType } from "./Message";

interface MessageContextMenuProps {
  message: MessageType;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: string) => void;
  isUserMessage: boolean;
}

const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  message,
  position,
  onClose,
  onAction,
  isUserMessage
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

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-[rgba(31,31,34,0.9)] text-white rounded-md shadow-lg"
      style={{ top: position.y, left: position.x, width: "12rem" }}
    >
      <ul className="py-1">
        <MenuItem
          icon={FaReply}
          label="Reply"
          onClick={() => onAction("reply")}
        />
        <MenuItem
          icon={FaCopy}
          label="Copy Text"
          onClick={() => onAction("copy")}
        />
        <MenuItem
          icon={FaForward}
          label="Forward"
          onClick={() => onAction("forward")}
        />
        <MenuItem
          icon={FaThumbtack}
          label="Pin Message"
          onClick={() => onAction("pin")}
        />
        {isUserMessage && (
          <>
            <MenuItem
              icon={FaEdit}
              label="Edit Message"
              onClick={() => onAction("edit")}
            />
            <MenuItem
              icon={FaTrash}
              label="Delete Message"
              onClick={() => onAction("delete")}
              isDanger={true}
            />
          </>
        )}
      </ul>
    </div>
  );
};

export default MessageContextMenu; 