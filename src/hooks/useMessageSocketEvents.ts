import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Socket } from "socket.io-client";
import { addMessage, updateMessage } from "@/features/root/messages/slices/messagesSlice";
import { formatMessageForStore, formatMessageForUI } from "@/utils/messageFormatters";

/**
 * Hook to handle all socket message events in a centralized way
 */
export function useMessageSocketEvents(
  socket: Socket | null, 
  selectedChannelId: string | null,
  setAllMessages: React.Dispatch<React.SetStateAction<any[]>>
) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;
    
    // Handle new messages from socket
    const handleNewMessage = (message: any) => {
      console.log('New message received via socket:', message);
      
      // Only process messages for the current channel
      if (message.channelId === selectedChannelId) {
        // Format for Redux store and UI
        const formattedMessageForStore = formatMessageForStore(message);
        const formattedMessage = formatMessageForUI(message);
        
        // Update state
        dispatch(addMessage(formattedMessageForStore));
        setAllMessages(prev => [...prev, formattedMessage]);
      }
    };

    // Handle messages with attachments
    const handleAttachmentMessageCreated = (message: any) => {
      console.log('New message with attachment received via socket:', message);
      
      // Only process messages for the current channel
      if (message.channelId === selectedChannelId) {
        // Format for Redux store and UI
        const formattedMessageForStore = formatMessageForStore(message);
        const formattedMessage = formatMessageForUI(message);
        
        // Update state
        dispatch(addMessage(formattedMessageForStore));
        setAllMessages(prev => [...prev, formattedMessage]);
      }
    };

    // Handle updated messages from socket
    const handleMessageUpdated = (message: any) => {
      console.log('Message updated via socket:', message);
      
      // Format for Redux store
      const formattedMessageForStore = formatMessageForStore(message);
      
      // Update in Redux store
      dispatch(updateMessage(formattedMessageForStore));
      
      // Update in UI messages
      setAllMessages(prev => 
        prev.map(msg => 
          msg.id === message._id 
            ? formatMessageForUI(message)
            : msg
        )
      );
    };
    
    // Handle pinned messages from socket
    const handleMessagePinned = (message: any) => {
      console.log('Message pinned via socket:', message);
      
      // Format for Redux store
      const formattedMessageForStore = formatMessageForStore(message);
      formattedMessageForStore.pinned = true;
      
      // Update in Redux store
      dispatch(updateMessage(formattedMessageForStore));
      
      // Update in UI messages
      setAllMessages(prev => 
        prev.map(msg => 
          msg.id === message._id 
            ? {...formatMessageForUI(message), pinned: true}
            : msg
        )
      );
    };
    
    // Handle unpinned messages from socket
    const handleMessageUnpinned = (message: any) => {
      console.log('Message unpinned via socket:', message);
      
      // Format for Redux store
      const formattedMessageForStore = formatMessageForStore(message);
      formattedMessageForStore.pinned = false;
      
      // Update in Redux store
      dispatch(updateMessage(formattedMessageForStore));
      
      // Update in UI messages
      setAllMessages(prev => 
        prev.map(msg => 
          msg.id === message._id 
            ? {...formatMessageForUI(message), pinned: false}
            : msg
        )
      );
    };

    // Handle deleted messages from socket
    const handleMessageDeleted = (data: any) => {
      console.log('Message deleted via socket:', data);
      if (data && data.messageId) {
        // Update UI messages to mark as deleted
        setAllMessages(prev => 
          prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, deletedAt: new Date().toISOString() }
              : msg
          )
        );
      }
    };

    // Handle forwarded messages from socket
    const handleMessageForwarded = (message: any) => {
      console.log('Message forwarded via socket:', message);
      // Handle as a new message if in the current channel
      if (message.channelId === selectedChannelId) {
        const formattedMessageForStore = formatMessageForStore(message);
        dispatch(addMessage(formattedMessageForStore));
        const formattedMessage = formatMessageForUI(message);
        setAllMessages(prev => [...prev, formattedMessage]);
      }
    };
    
    // Register socket event listeners
    socket.on('message', handleNewMessage);
    socket.on('message_updated', handleMessageUpdated);
    socket.on('message_pinned', handleMessagePinned);
    socket.on('message_unpinned', handleMessageUnpinned);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('message_forwarded', handleMessageForwarded);
    socket.on('message_with_attachment', handleAttachmentMessageCreated);
    
    // Cleanup function to remove event listeners
    return () => {
      socket.off('message', handleNewMessage);
      socket.off('message_updated', handleMessageUpdated);
      socket.off('message_pinned', handleMessagePinned);
      socket.off('message_unpinned', handleMessageUnpinned);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('message_forwarded', handleMessageForwarded);
      socket.off('message_with_attachment', handleAttachmentMessageCreated);
    };
  }, [socket, dispatch, selectedChannelId, setAllMessages]);
} 