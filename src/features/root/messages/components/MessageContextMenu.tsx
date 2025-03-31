import React, { useEffect, useRef, useState } from "react";
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
  const [menuPos, setMenuPos] = useState({ ...position });
  const [transformOrigin, setTransformOrigin] = useState("top left");

  // Calculate optimal position and transform origin on mount
  useEffect(() => {
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      let { x, y } = position;
      let origin = "top left";

      // Check if menu would overflow bottom of viewport
      if (y + menuRect.height > window.innerHeight) {
        y = Math.max(5, window.innerHeight - menuRect.height - 5);
        origin = "bottom left";
      }

      // Check if menu would overflow right of viewport
      if (x + menuRect.width > window.innerWidth) {
        x = Math.max(5, window.innerWidth - menuRect.width - 5);
        origin = origin.replace("left", "right");
      }

      setMenuPos({ x, y });
      setTransformOrigin(origin);
    }
  }, [position]);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    // Close context menu on escape key
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-[rgba(31,31,34,0.95)] text-white rounded-md shadow-lg border border-dark-4 animate-in fade-in zoom-in duration-150"
      style={{ 
        top: menuPos.y, 
        left: menuPos.x, 
        width: "12rem",
        transformOrigin,
        maxHeight: "calc(100vh - 20px)",
        overflowY: "auto"
      }}
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
          label={message.pinned ? "Unpin Message" : "Pin Message"}
          onClick={() => onAction("pin")}
          className={message.pinned ? "text-yellow-500" : ""}
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