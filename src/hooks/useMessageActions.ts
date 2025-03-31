import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { toast } from 'react-hot-toast';
import { useDeleteMessageMutation, usePinMessageMutation, useUnpinMessageMutation } from "@/features/root/messages/slices/messagesApiSlice";
import { useDeleteAttachmentMutation } from "@/features/root/attachments/slices/attachmentsApiSlice";
import { MessageType } from "@/features/root/messages/types/messageTypes";


export function useMessageActions(socket: Socket | null) {
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
      // Then delete the message
      await deleteMessage({ messageId: message.id }).unwrap();
      
      toast.success('Message deleted successfully', {
        position: 'bottom-center',
        style: {
          borderRadius: '10px',
          background: '#10B981',
          color: '#fff',
        }
      });
      
      return true;
    } catch (error) {
      console.error("Failed to delete message:", error);
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
      return true;
    } catch (error) {
      console.error("Failed to pin/unpin message:", error);
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
        return false;
      }
    } catch (error) {
      console.error("Failed to edit message:", error);
      return false;
    }
  };

  return {
    handleDeleteMessage,
    handlePinMessage,
    handleEditMessage
  };
}