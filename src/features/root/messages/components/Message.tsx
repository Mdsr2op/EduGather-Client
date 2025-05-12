import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
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
import DeletedMessage from "./ui/DeletedMessage";
import toast from "react-hot-toast";

export interface MessageProps {
  message: MessageType;
  isUserMessage: boolean;
  showTimestamp?: boolean;
}

const Message = ({ message, isUserMessage, showTimestamp = false }: MessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const { groupId = "" } = useParams<{ groupId: string }>();
  const { socket } = useSocket();
  
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState(message.text);
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    position: { x: 0, y: 0 }
  });

  // Check if this is a meeting attachment
  const isMeetingAttachment = message.attachment?.fileType === 'application/meeting';
  
  // Use our enhanced message actions hook for all operations
  const { 
    handleDeleteMessage, 
    handlePinMessage, 
    handleEditMessage,
    handleReplyToMessage,
    handleCopyMessage,
    canEditMessage
  } = useMessageActions(socket);

  const handleContextMenu = (e: React.MouseEvent) => {
    // Prevent context menu for message reply info and meeting attachments
    if ((e.target as HTMLElement).closest('.message-reply-info') || 
        isMeetingAttachment) {
      return;
    }
    
    // For attachments, only show context menu when clicking on the actual content,
    // not on the outer container
    if (message.attachment) {
      const target = e.target as HTMLElement;
      const isAttachmentContainer = target.matches('.message-attachment') || 
                                    (target.parentElement && target.parentElement.matches('.message-attachment'));
      const isAttachmentContent = target.matches('.attachment-content') || 
                                  target.closest('.attachment-content');
      
      // If clicking on attachment container but not on content, prevent context menu
      if (isAttachmentContainer && !isAttachmentContent) {
        return;
      }
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
    // Don't allow certain actions for attachment messages
    if (message.attachment && (action === 'edit' || action === 'pin' || action === 'copy')) {
      closeContextMenu();
      return;
    }

    switch (action) {
      case "edit":
        if (canEditMessage(message)) {
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
        handleReplyToMessage(message);
        break;
      case "pin":
        await handlePinMessage(message.id, !message.pinned);
        break;
      case "copy":
        handleCopyMessage(message.text);
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
  
  // Get classes for message bubble based on message properties
  const getMessageBubbleClasses = () => {
    const baseClasses = `py-1.5 sm:py-2 px-2 sm:px-3 rounded-xl cursor-pointer transition-all ${
      isUserMessage 
        ? "bg-gradient-to-r from-primary-500 via-primary-600 to-blue-500 text-light-1 shadow-md" 
        : "bg-dark-4 text-light-1 hover:bg-dark-5"
    } ${message.pinned ? "border-2 border-yellow-500" : ""}`;
    
    // Add appropriate border radius for reply
    if (message.replyTo) {
      return `${baseClasses} rounded-tl-none`;
    }
    
    return baseClasses;
  };

  // If message is deleted, display the DeletedMessage component instead
  if (message.deletedAt) {
    console.log("Message is deleted", message);
    return (
      <DeletedMessage 
        message={{...message, id: `${message.id}-deleted`}} 
        isUserMessage={isUserMessage} 
        showTimestamp={showTimestamp} 
      />
    );
  }
  
  return (
    <>
      <motion.div
        id={`message-${message.id}`}
        initial={{ opacity: 0, x: isUserMessage ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex ${isUserMessage ? "justify-end" : "justify-start"} relative my-1 transition-all duration-300`}
        onContextMenu={handleContextMenu}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div 
          ref={messageRef}
          whileHover={{ scale: 1.01 }}
          className={`flex ${isMeetingAttachment ? 'w-full' : 'max-w-[85%] sm:max-w-xs md:max-w-md lg:max-w-lg'} ${isUserMessage ? "flex-row-reverse" : ""} relative`}
        >
          {!isUserMessage && <MessageAvatar senderName={message.senderName} />}
          <div className={`mx-1 ${isMeetingAttachment ? 'w-full' : ''} relative`}>
            {/* Username overlay on hover */}
            <AnimatePresence>
              {isHovered && !editMode && !isMeetingAttachment && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute ${isUserMessage ? 'right-1' : 'left-1'} -top-6 bg-dark-2/80 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-md z-10`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-primary-400">{message.senderName}</span>
                    <span className="text-[10px] text-light-3">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                    {message.text && (
                      <div className="text-sm sm:text-base">
                        <MessageContent text={message.text} />
                      </div>
                    )}
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
              <div className={`flex items-center text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1 ${
                isMeetingAttachment && isUserMessage ? 'justify-end' : ''
              }`}>
                <MessageTimestamp
                  timestamp={message.timestamp}
                  isUserMessage={isUserMessage}
                />
                {isEdited && (
                  <span className="ml-1 text-gray-400">(edited)</span>
                )}
                {message.forwardedFrom && message.forwardedFrom.messageId && (
                  <span className="ml-1 text-gray-400">(forwarded)</span>
                )}
                {message.pinned && (
                  <span className="ml-2 text-yellow-500">📌 Pinned</span>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      
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