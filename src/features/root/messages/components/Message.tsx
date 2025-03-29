import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import MessageAvatar from "./MessageAvatar";
import MessageTimestamp from "./MessageTimestamp";
import MessageContextMenu from "./MessageContextMenu";
import { 
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
import { useSocket } from "@/lib/socket";

export interface MessageType {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  pinned?: boolean;
  attachment?: {
    id: string;
    url: string;
    fileType: string;
    fileName: string;
    size: number;
  };
  replyTo?: {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
  };
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
  const userId = useSelector((state: any) => state.auth.user?._id);
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(message.text);
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const { socket } = useSocket();
  
  // For image attachment
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Get current group ID from URL params
  const { groupId = "" } = useParams<{ groupId: string }>();
  
  // API mutation hooks
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

  // Check if attachment is an image
  const isImageAttachment = message.attachment?.fileType?.startsWith('image/');

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
        if (socket) {
          // Use socket to edit message
          socket.emit('edit_message', {
            messageId: message.id,
            content: editContent,
            mentions: [] // Add mention logic if needed
          });
        } else {
          console.error('Socket not connected');
        }
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
            if (socket) {
              // Use socket to unpin message
              socket.emit('unpin_message', {
                messageId: message.id,
                userId: userId // This needs to be accessed from auth state
              });
            } else {
              // Fallback to API if socket not available
              await unpinMessage({ messageId: message.id }).unwrap();
            }
          } else {
            if (socket) {
              // Use socket to pin message
              socket.emit('pin_message', {
                messageId: message.id,
                userId: userId // This needs to be accessed from auth state
              });
            } else {
              // Fallback to API if socket not available
              await pinMessage({ messageId: message.id }).unwrap();
            }
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
        className={`flex ${isUserMessage ? "justify-end" : "justify-start"} relative my-0.5`}
        onContextMenu={handleContextMenu}
      >
        <div 
          ref={messageRef}
          className={`flex max-w-xs md:max-w-md lg:max-w-lg ${isUserMessage ? "flex-row-reverse" : ""}`}
        >
          {!isUserMessage && <MessageAvatar senderName={message.senderName} />}
          <div className="mx-1">
            {/* Show reply info if this message is a reply */}
            {message.replyTo && (
              <div className="px-3 py-1 mb-1 text-xs text-gray-400 bg-dark-5 rounded-t-lg flex items-center">
                <span className="mr-1">Reply to</span>
                <span className="font-semibold">{message.replyTo.senderName}</span>: 
                <span className="ml-1 truncate">{message.replyTo.text.substring(0, 50)}{message.replyTo.text.length > 50 ? '...' : ''}</span>
              </div>
            )}
            
            <div
              className={`py-2 px-3 rounded-xl cursor-pointer transition-transform transform hover:scale-105 ${
                isUserMessage ? "bg-gradient-to-r from-primary-500 via-primary-600 to-blue-500 text-light-1" : "bg-dark-4 text-light-1"
              } ${message.pinned ? "border-2 border-yellow-500" : ""} ${message.replyTo ? "rounded-tl-none" : ""}`}
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
                <div>
                                    {/* Display image attachment if available */}
                                    {isImageAttachment && message.attachment && (
                    <div className={`${imageLoaded ? '' : 'min-h-[200px] flex items-center justify-center'}`}>
                      {!imageLoaded && <div className="animate-pulse">Loading image...</div>}
                      <img 
                        src={message.attachment.url} 
                        alt={message.attachment.fileName}
                        className="rounded-lg max-w-full max-h-[300px] object-contain"
                        onLoad={() => setImageLoaded(true)}
                        style={{ display: imageLoaded ? 'block' : 'none' }}
                      />
                    </div>
                  )}
                  
                  {/* Display non-image attachment if available */}
                  {message.attachment && !isImageAttachment && (
                    <div className="flex items-center p-2 bg-dark-5 rounded-lg">
                      <div className="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <div className="flex-1 truncate">
                        <div className="text-sm font-medium truncate">{message.attachment.fileName}</div>
                        <div className="text-xs text-gray-400">
                          {(message.attachment.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                      <a 
                        href={message.attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-2 p-1 rounded-full hover:bg-dark-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    </div>
                  )}
                  {/* Display message text if available */}
                  {message.text && <p className="text-lg mb-1">{message.text}</p>}
                  

                </div>
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