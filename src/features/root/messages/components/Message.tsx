import { useState, useRef } from "react";
import MessageAvatar from "./MessageAvatar";
import MessageTimestamp from "./MessageTimestamp";
import MessageContextMenu from "./MessageContextMenu";

export interface MessageType{
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
}

export interface MessageProps {
  message: MessageType;
  isUserMessage: boolean;
  showTimestamp?: boolean; // Optional prop to control timestamp visibility
}

const Message = ({message, isUserMessage, showTimestamp = false}: MessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    position: { x: number; y: number };
  }>({
    visible: false,
    position: { x: 0, y: 0 }
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Get menu dimensions (approximation)
    const menuWidth = 192; // 12rem = 192px
    const menuHeight = 200; // Approximate height

    let x = e.clientX;
    let y = e.clientY;
    
    // If user is the sender, position the menu at the bottom left of the message
    if (isUserMessage && messageRef.current) {
      const messageRect = messageRef.current.getBoundingClientRect();
      x = messageRect.left;
      y = messageRect.bottom;
    }
    
    // Ensure menu stays within viewport
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth;
    }
    
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight;
    }
    
    setContextMenu({
      visible: true,
      position: { x, y }
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleMessageAction = (action: string) => {
    // Handle different actions
    switch (action) {
      case "edit":
        // Handle edit action
        console.log("Edit message:", message.id);
        break;
      case "delete":
        // Handle delete action
        console.log("Delete message:", message.id);
        break;
      case "reply":
        // Handle reply action
        console.log("Reply to message:", message.id);
        break;
      case "pin":
        // Handle pin action
        console.log("Pin message:", message.id);
        break;
      case "copy":
        // Copy message text to clipboard
        navigator.clipboard.writeText(message.text);
        console.log("Copied message text to clipboard");
        break;
      case "forward":
        // Handle forward action
        console.log("Forward message:", message.id);
        break;
      default:
        break;
    }
    closeContextMenu();
  };

  return (
    <>
      <div
        className={`flex ${isUserMessage ? "justify-end" : "justify-start"} relative my-1`}
        onContextMenu={handleContextMenu}
      >
        <div 
          ref={messageRef}
          className={`flex max-w-xs md:max-w-md lg:max-w-lg ${isUserMessage ? "flex-row-reverse" : ""}`}
        >
          {!isUserMessage && <MessageAvatar senderName={message.senderName} />}
          <div className="mx-1">
            <div
              className={`py-2 px-3 rounded-xl cursor-pointer transition-transform transform hover:scale-105 ${
                isUserMessage ? "bg-gradient-to-r from-primary-500 via-primary-600 to-blue-500 text-light-1" : "bg-dark-4 text-light-1"
              }`}
            >
                <p className="text-lg">{message.text}</p>
            </div>
            {showTimestamp && (
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <MessageTimestamp
                  timestamp={message.timestamp}
                  isUserMessage={isUserMessage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {contextMenu.visible && (
        <MessageContextMenu
          message={message}
          position={contextMenu.position}
          onClose={closeContextMenu}
          onAction={handleMessageAction}
          isUserMessage={isUserMessage}
        />
      )}
    </>
  );
};

export default Message;