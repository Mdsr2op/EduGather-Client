import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import MessageAvatar from "./MessageAvatar";
import MessageTimestamp from "./MessageTimestamp";
import MessageContextMenu from "./MessageContextMenu";
import { 
  useEditMessageMutation,
  useDeleteMessageMutation,
  usePinMessageMutation,
  useUnpinMessageMutation,
  useReplyMessageMutation
} from "../slices/messagesApiSlice";
import { selectSelectedChannelId } from "../../channels/slices/channelSlice";
import { useDispatch } from "react-redux";
import { setReplyTo } from "../slices/messagesSlice";
import ForwardMessageDialog from "../dialogs/ForwardMessageDialog";
import { useParams } from "react-router-dom";

export interface MessageType {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  pinned?: boolean;
}

export interface MessageProps {
  message: MessageType;
  isUserMessage: boolean;
  showTimestamp?: boolean; // Optional prop to control timestamp visibility
}

const Message = ({message, isUserMessage, showTimestamp = false}: MessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const selectedChannelId = useSelector(selectSelectedChannelId);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(message.text);
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  
  // Get current group ID from URL params
  const { groupId = "" } = useParams<{ groupId: string }>();
  
  // API mutation hooks
  const [editMessage] = useEditMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [pinMessage] = usePinMessageMutation();
  const [unpinMessage] = useUnpinMessageMutation();
  
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

  const handleSaveEdit = async () => {
    if (editContent.trim() !== message.text) {
      try {
        await editMessage({
          messageId: message.id,
          data: {
            content: editContent,
            mentions: [] // Add mention logic if needed
          }
        }).unwrap();
      } catch (error) {
        console.error("Failed to edit message:", error);
      }
    }
    setEditMode(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditMode(false);
      setEditContent(message.text);
    }
  };

  const handleMessageAction = async (action: string) => {
    // Handle different actions
    switch (action) {
      case "edit":
        setEditMode(true);
        setEditContent(message.text);
        break;
      case "delete":
        try {
          await deleteMessage({ messageId: message.id }).unwrap();
        } catch (error) {
          console.error("Failed to delete message:", error);
        }
        break;
      case "reply":
        // Set the reply message in the global state
        dispatch(setReplyTo({
          _id: message.id,
          content: message.text,
          senderId: {
            _id: message.senderId,
            username: message.senderName
          },
          channelId: selectedChannelId || "",
          createdAt: new Date(message.timestamp).toISOString(),
          updatedAt: new Date(message.timestamp).toISOString(),
          pinned: message.pinned || false
        }));
        break;
      case "pin":
        try {
          if (message.pinned) {
            await unpinMessage({ messageId: message.id }).unwrap();
          } else {
            await pinMessage({ messageId: message.id }).unwrap();
          }
        } catch (error) {
          console.error("Failed to pin/unpin message:", error);
        }
        break;
      case "copy":
        // Copy message text to clipboard
        navigator.clipboard.writeText(message.text);
        break;
      case "forward":
        // Open forward dialog
        setForwardDialogOpen(true);
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
              } ${message.pinned ? "border-2 border-yellow-500" : ""}`}
            >
              {editMode && isUserMessage ? (
                <div className="flex flex-col">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="bg-transparent text-light-1 focus:outline-none resize-none w-full"
                    autoFocus
                  />
                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={() => {
                        setEditMode(false);
                        setEditContent(message.text);
                      }}
                      className="text-xs mr-2 text-light-2 hover:text-light-1"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveEdit}
                      className="text-xs text-primary-500 hover:text-primary-400"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-lg">{message.text}</p>
              )}
            </div>
            {showTimestamp && (
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <MessageTimestamp
                  timestamp={message.timestamp}
                  isUserMessage={isUserMessage}
                />
                {message.pinned && (
                  <span className="ml-2 text-yellow-500">📌 Pinned</span>
                )}
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
      
      {/* Forward Message Dialog */}
      <ForwardMessageDialog
        open={forwardDialogOpen}
        onOpenChange={setForwardDialogOpen}
        message={message}
        groupId={groupId}
      />
    </>
  );
};

export default Message;