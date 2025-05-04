import { useSelector, useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import { toast } from 'react-hot-toast';
import { 
  useDeleteMessageMutation, 
  usePinMessageMutation, 
  useUnpinMessageMutation 
} from "@/features/root/messages/slices/messagesApiSlice";
import { useDeleteAttachmentMutation } from "@/features/root/attachments/slices/attachmentsApiSlice";
import { MessageType } from "@/features/root/messages/types/messageTypes";
import { setReplyTo } from "@/features/root/messages/slices/messagesSlice";

export function useMessageActions(socket: Socket | null) {
  const dispatch = useDispatch();
  const userId = useSelector((state: any) => state.auth.user?._id);
  const [deleteMessage] = useDeleteMessageMutation();
  const [pinMessage] = usePinMessageMutation();
  const [unpinMessage] = useUnpinMessageMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();

  const handleDeleteMessage = async (message: MessageType) => {
    try {
      // If message has attachment, delete it first
      if (message.attachment) {
        await deleteAttachment(message.attachment.id).unwrap();
      }

      if (socket) {
        socket.emit('delete_message', {
          messageId: message.id,
          userId
        });
      } else {
        await deleteMessage({ messageId: message.id }).unwrap();
      }
      
      console.log("Message deleted successfully", message);
      toast.success('Message deleted successfully', {
        position: 'bottom-center'
      });
      
      return true;
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error('Failed to delete message');
      return false;
    }
  };

  const handlePinMessage = async (messageId: string, isPinning: boolean) => {
    try {
      if (socket) {
        // Use socket to pin/unpin message
        socket.emit(isPinning ? 'pin_message' : 'unpin_message', {
          messageId,
          userId
        });
      } else {
        // Fallback to API if socket not available
        if (isPinning) {
          await pinMessage({ messageId }).unwrap();
        } else {
          await unpinMessage({ messageId }).unwrap();
        }
      }
      
      toast.success(isPinning ? 'Message pinned' : 'Message unpinned', {
        position: 'bottom-center'
      });
      
      return true;
    } catch (error) {
      console.error("Failed to pin/unpin message:", error);
      toast.error(isPinning ? 'Failed to pin message' : 'Failed to unpin message');
      return false;
    }
  };

  const handleEditMessage = async (messageId: string, content: string) => {
    try {
      if (socket) {
        // Use socket to edit message
        socket.emit('edit_message', {
          messageId,
          content,
          mentions: [] // Add mention logic if needed
        });
        return true;
      } else {
        console.error('Socket not connected');
        toast.error('Failed to edit message: No connection');
        return false;
      }
    } catch (error) {
      console.error("Failed to edit message:", error);
      toast.error('Failed to edit message');
      return false;
    }
  };
  
  // Function to handle replying to a message
  const handleReplyToMessage = (message: MessageType) => {
    dispatch(setReplyTo({
      messageId: message.id,
      content: message.text,
      senderId: {
        _id: message.senderId,
        username: message.senderName
      },
    }));
    return true;
  };
  
  // Function to handle forwarding a message
  const handleForwardMessage = async (messageId: string, channelId: string) => {
    try {
      if (socket) {
        socket.emit('forward_message', {
          messageId,
          channelId,
          userId
        });
        toast.success('Message forwarded');
        return true;
      } else {
        toast.error('Failed to forward message: No connection');
        return false;
      }
    } catch (error) {
      console.error("Failed to forward message:", error);
      toast.error('Failed to forward message');
      return false;
    }
  };
  
  // Function to copy message text to clipboard
  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard', {
      position: "top-center",
    });
    return true;
  };
  
  // Function to check if message can be edited (within one hour)
  const canEditMessage = (message: MessageType): boolean => {
    const currentTime = new Date().getTime();
    const messageTime = message.createdAt 
      ? new Date(message.createdAt).getTime() 
      : new Date(message.timestamp).getTime();
    const oneHourInMs = 60 * 60 * 1000;
    
    return currentTime - messageTime <= oneHourInMs;
  };

  return {
    handleDeleteMessage,
    handlePinMessage,
    handleEditMessage,
    handleReplyToMessage,
    handleForwardMessage,
    handleCopyMessage,
    canEditMessage
  };
}