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
import { MessageType } from "../types/messageTypes";
import { useAppSelector } from "@/redux/hook";
import { useParams } from "react-router-dom";
import { useGetGroupDetailsQuery } from "../../groups/slices/groupApiSlice";
import { useSelector } from "react-redux";
import { selectSelectedGroupId } from "../../groups/slices/groupSlice";

interface MessageContextMenuProps {
  message: MessageType;
  position: { x: number; y: number };
  onClose: () => void;
  onAction: (action: string) => void;
  isUserMessage: boolean;
  isAdmin?: boolean;
  isModerator?: boolean;
}

const MessageContextMenu: React.FC<MessageContextMenuProps> = ({
  message,
  position,
  onClose,
  onAction,
  isUserMessage,
  isAdmin = false,
  isModerator = false
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ ...position });
  const [transformOrigin, setTransformOrigin] = useState("top left");
  
  // Get current user ID from auth state
  const currentUserId = useAppSelector(state => state.auth.user?._id);
  
  // Get the current group ID from URL params or Redux state
  const { groupId: paramGroupId } = useParams<{ groupId: string }>();
  const selectedGroupId = useSelector(selectSelectedGroupId);
  const groupId = paramGroupId || selectedGroupId;
  
  // Fetch group details to check user roles
  const { data: groupDetails } = useGetGroupDetailsQuery(groupId || "", {
    skip: !groupId
  });
  
  // Determine if current user is admin or moderator
  const userRole = currentUserId && groupDetails?.members?.find(
    member => member._id === currentUserId
  )?.role || "member";
  
  const isUserAdmin = userRole === "admin" || isAdmin;
  const isUserModerator = userRole === "moderator" || isModerator;
  
  // Check if user can delete message (author, admin or moderator)
  const canDeleteMessage = isUserMessage || isUserAdmin || isUserModerator;

  // Check if message is within one hour edit window
  const isWithinEditWindow = () => {
    const currentTime = new Date().getTime();
    const messageTime = message.createdAt 
      ? new Date(message.createdAt).getTime() 
      : new Date(message.timestamp).getTime();
    const oneHourInMs = 60 * 60 * 1000;
    
    return currentTime - messageTime <= oneHourInMs;
  };

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
          <MenuItem
            icon={FaEdit}
            label={isWithinEditWindow() ? "Edit Message" : "Edit Message (expired)"}
            onClick={() => onAction("edit")}
            disabled={!isWithinEditWindow()}
          />
        )}
        {canDeleteMessage && (
          <MenuItem
            icon={FaTrash}
            label="Delete Message"
            onClick={() => onAction("delete")}
            isDanger={true}
          />
        )}
      </ul>
    </div>
  );
};

export default MessageContextMenu; 