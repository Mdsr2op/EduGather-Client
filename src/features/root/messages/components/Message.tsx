import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { selectSelectedChannelId } from "../../channels/slices/channelSlice";
import { setReplyTo } from "../slices/messagesSlice";
import { useSocket } from "@/lib/socket";
import MessageAvatar from "./MessageAvatar";
import MessageTimestamp from "./MessageTimestamp";
import MessageContextMenu from "./MessageContextMenu";
import DeleteMessageDialog from "../dialogs/DeleteMessageDialog";
import { MessageType } from "../types/messageTypes";
import { useMessageActions } from "@/hooks/useMessageActions";
import MessageEditForm from "./ui/MessageEditForm";
import MessageReplyInfo from "./ui/MessageReplyInfo";
import MessageAttachment from "./ui/MessageAttachment";
import ForwardMessageDialog from "../dialogs/ForwardMessageDialog";
import MessageContent from "./ui/MessageContent";
import toast from "react-hot-toast";
export interface MessageProps {
  message: MessageType;
  isUserMessage: boolean;
  showTimestamp?: boolean;
}

const Message = ({ message, isUserMessage, showTimestamp = false }: MessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const selectedChannelId = useSelector(selectSelectedChannelId);
  const { groupId = "" } = useParams<{ groupId: string }>();
  const { socket } = useSocket();
  
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(message.text);
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 }
  });

  const { 
    handleDeleteMessage, 
    handlePinMessage, 
    handleEditMessage 
  } = useMessageActions(socket);

  const handleContextMenu = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.message-reply-info')) {
      return;
    }
    
    e.preventDefault();
    
    const menuWidth = 192;
    const menuHeight = 250;
    let x = e.clientX;
    let y = e.clientY;
    
    if (isUserMessage && messageRef.current) {
      const messageRect = messageRef.current.getBoundingClientRect();
      x = messageRect.left;
      y = messageRect.bottom;
    }

    // Adjust position to ensure menu stays within viewport
    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    
    if (y + menuHeight > window.innerHeight) {
      if (isUserMessage && messageRef.current) {
        const messageRect = messageRef.current.getBoundingClientRect();
        y = messageRect.top > menuHeight ? messageRect.top - menuHeight : Math.max(10, window.innerHeight - menuHeight - 10);
      } else {
        y = window.innerHeight - menuHeight - 10;
      }
    }
    
    if (y < 10) y = 10;
    
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
      await handleEditMessage(message.id, editContent);
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
    switch (action) {
      case "edit":
        // Check if message is within one hour edit window
        const currentTime = new Date().getTime();
        const messageTime = message.createdAt 
          ? new Date(message.createdAt).getTime() 
          : new Date(message.timestamp).getTime();
        const oneHourInMs = 60 * 60 * 1000;
        
        if (currentTime - messageTime <= oneHourInMs) {
          setEditMode(true);
          setEditContent(message.text);
        } else {
          toast.error('Editing is not allowed after one hour');
        }
        break;
      case "delete":
        setDeleteDialogOpen(true);
        break;
      case "reply":
        dispatch(setReplyTo({
          messageId: message.id,
          content: message.text,
          senderId: {
            _id: message.senderId,
            username: message.senderName
          },
        }));
        break;
      case "pin":
        await handlePinMessage(message.id, !message.pinned);
        break;
      case "copy":
        navigator.clipboard.writeText(message.text);
        break;
      case "forward":
        setForwardDialogOpen(true);
        break;
      default:
        break;
    }
    closeContextMenu();
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      await handleDeleteMessage(message);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete message:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if message has been edited
  const isEdited = message.updatedAt && message.createdAt && new Date(message.updatedAt).getTime() > new Date(message.createdAt).getTime();
  
  // Check if this is a meeting attachment
  const isMeetingAttachment = message.attachment?.fileType === 'application/meeting';

  // Get classes for message bubble based on message properties
  const getMessageBubbleClasses = () => {
    const baseClasses = `py-2 px-3 rounded-xl cursor-pointer transition-transform transform hover:scale-105 ${
      isUserMessage ? "bg-gradient-to-r from-primary-500 via-primary-600 to-blue-500 text-light-1" : "bg-dark-4 text-light-1"
    } ${message.pinned ? "border-2 border-yellow-500" : ""}`;
    
    // Add appropriate border radius for reply
    if (message.replyTo) {
      return `${baseClasses} rounded-tl-none`;
    }
    
    return baseClasses;
  };

  return (
    <>
      <div
        id={`message-${message.id}`}
        className={`flex ${isUserMessage ? "justify-end" : "justify-start"} relative my-0.5 transition-colors duration-500`}
        onContextMenu={handleContextMenu}
      >
        <div 
          ref={messageRef}
          className={`flex ${isMeetingAttachment ? 'w-full' : 'max-w-xs md:max-w-md lg:max-w-lg'} ${isUserMessage ? "flex-row-reverse" : ""}`}
        >
          {!isUserMessage && <MessageAvatar senderName={message.senderName} />}
          <div className={`mx-1 ${isMeetingAttachment ? 'w-full' : ''}`}>
            {message.replyTo && (
              <div className={`${isUserMessage ? "items-end" : "items-start"} message-reply-info`}>
                <MessageReplyInfo replyTo={message.replyTo} />
              </div>
            )}
            
            {!isMeetingAttachment && (
              <div className={getMessageBubbleClasses()}>
                {editMode && isUserMessage ? (
                  <MessageEditForm 
                    content={editContent}
                    setContent={setEditContent}
                    onSave={handleSaveEdit}
                    onCancel={() => {
                      setEditMode(false);
                      setEditContent(message.text);
                    }}
                    onKeyDown={handleKeyPress}
                  />
                ) : (
                  <div>
                    {message.attachment && !isMeetingAttachment && (
                      <MessageAttachment attachment={message.attachment} isUserMessage={isUserMessage} />
                    )}
                    {message.text && <MessageContent text={message.text} />}
                  </div>
                )}
              </div>
            )}

            {isMeetingAttachment && message.attachment && (
              <div className={`${isUserMessage ? 'flex justify-end' : 'flex justify-start'}`}>
                <MessageAttachment attachment={message.attachment} isUserMessage={isUserMessage} />
              </div>
            )}
            
            {showTimestamp && (
              <div className={`flex items-center text-xs text-gray-400 mt-1 ${
                isMeetingAttachment && isUserMessage ? 'justify-end' : ''
              }`}>
                <MessageTimestamp
                  timestamp={message.timestamp}
                  isUserMessage={isUserMessage}
                />
                {isEdited && (
                  <span className="ml-1 text-gray-400">(edited)</span>
                )}
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
      
      <ForwardMessageDialog
        open={forwardDialogOpen}
        onOpenChange={setForwardDialogOpen}
        message={message}
        groupId={groupId}
      />

      <DeleteMessageDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        message={message}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default Message;