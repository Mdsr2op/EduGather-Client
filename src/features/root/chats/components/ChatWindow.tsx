// ChatWindow.js
import React, { useEffect, useRef, useState } from 'react';
import MessageBody from './MessageBody';
import ChatInput from './ChatInput';
import { useSelector, useDispatch } from 'react-redux';
import { selectSelectedChannelId } from '../../channels/slices/channelSlice';
import { useGetMessagesQuery } from '../../messages/slices/messagesApiSlice';
import { useSocket } from '@/lib/socket';
import { addMessage, updateMessage } from '../../messages/slices/messagesSlice';
import InfiniteScroll from 'react-infinite-scroll-component';

interface ChatWindowProps {
  userId: string;
}

const ChatWindow = ({ userId }: ChatWindowProps) => {
  const dispatch = useDispatch();
  const selectedChannelId = useSelector(selectSelectedChannelId);
  const { socket, connectToChannel } = useSocket();
  
  // State for pagination
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [allMessages, setAllMessages] = useState<any[]>([]);
  
  // Ref for the scrollable div
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  
  // State to track if user is at bottom of chat
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  
  // Store previous channel ID to prevent unnecessary reconnections
  const prevChannelIdRef = useRef<string | null>(null);
  
  // Store scroll height to maintain position when loading older messages
  const scrollHeightRef = useRef<number>(0);
  const scrollTopRef = useRef<number>(0);
  
  // Connect to channel via socket when channel is selected
  useEffect(() => {
    if (selectedChannelId && userId && selectedChannelId !== prevChannelIdRef.current) {
      connectToChannel(selectedChannelId, userId);
      prevChannelIdRef.current = selectedChannelId;
      
      // Reset pagination when changing channels
      setPage(1);
      setHasMore(true);
      setAllMessages([]);
      setIsAtBottom(true);
    }
  }, [selectedChannelId, userId]);
  
  // Socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    // Handle new messages from socket
    const handleNewMessage = (message: any) => {
      console.log('New message received via socket:', message);
      
      // First format for Redux store
      const formattedMessageForStore = {
        _id: message._id,
        content: message.content,
        senderId: typeof message.senderId === 'object' 
          ? message.senderId 
          : { _id: message.senderId, username: 'User' },
        channelId: message.channelId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        pinned: message.pinned || false,
        mentions: message.mentions || [],
        replyTo: message.replyTo || null,
        attachment: message.attachment || null
      };
      
      // Add to Redux store
      dispatch(addMessage(formattedMessageForStore));
      
      // Format the message for UI
      const formattedMessage: any = {
        id: message._id,
        text: message.content,
        senderId: typeof message.senderId === 'object' ? message.senderId._id : message.senderId,
        senderName: typeof message.senderId === 'object' ? message.senderId.username : 'User',
        timestamp: new Date(message.createdAt).getTime(),
        pinned: message.pinned || false
      };
      
      // Add reply information if available
      if (message.replyTo && message.replyTo.messageId) {
        formattedMessage.replyTo = {
          id: message.replyTo.messageId,
          text: message.replyTo.content || '',
          senderId: message.replyTo.senderId._id || '',
          senderName: message.replyTo.senderId.username || 'User'
        };
      }
      
      // Add attachment information if available
      if (message.attachment) {
        formattedMessage.attachment = {
          id: message.attachment._id,
          url: message.attachment.url,
          fileType: message.attachment.fileType,
          fileName: message.attachment.fileName,
          size: message.attachment.size
        };
      }
      
      // Add to UI messages
      setAllMessages(prev => [...prev, formattedMessage]);
      
      // No auto-scrolling for new messages
    };

    // Handle updated messages from socket
    const handleMessageUpdated = (message: any) => {
      console.log('Message updated via socket:', message);
      
      // Format for Redux store
      const formattedMessageForStore = {
        _id: message._id,
        content: message.content,
        senderId: typeof message.senderId === 'object' 
          ? message.senderId 
          : { _id: message.senderId, username: 'User' },
        channelId: message.channelId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        pinned: message.pinned || false,
        mentions: message.mentions || [],
        replyTo: message.replyTo || null,
        attachment: message.attachment || null
      };
      
      // Update in Redux store
      dispatch(updateMessage(formattedMessageForStore));
      
      // Update in UI messages
      setAllMessages(prev => 
        prev.map(msg => 
          msg.id === message._id 
            ? {
                ...msg,
                text: message.content,
                pinned: message.pinned || false,
                timestamp: new Date(message.updatedAt).getTime(),
                attachment: message.attachment ? {
                  id: message.attachment._id,
                  url: message.attachment.url,
                  fileType: message.attachment.fileType,
                  fileName: message.attachment.fileName,
                  size: message.attachment.size
                } : msg.attachment
              }
            : msg
        )
      );
    };
    
    // Handle pinned messages from socket
    const handleMessagePinned = (message: any) => {
      console.log('Message pinned via socket:', message);
      
      // Format for Redux store
      const formattedMessageForStore = {
        _id: message._id,
        content: message.content,
        senderId: typeof message.senderId === 'object' 
          ? message.senderId 
          : { _id: message.senderId, username: 'User' },
        channelId: message.channelId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        pinned: true,
        pinnedBy: message.pinnedBy,
        mentions: message.mentions || [],
        replyTo: message.replyTo || null,
        attachment: message.attachment || null
      };
      
      // Update in Redux store
      dispatch(updateMessage(formattedMessageForStore));
      
      // Update in UI messages
      setAllMessages(prev => 
        prev.map(msg => 
          msg.id === message._id 
            ? {
                ...msg,
                pinned: true,
                timestamp: new Date(message.updatedAt).getTime()
              }
            : msg
        )
      );
    };
    
    // Handle unpinned messages from socket
    const handleMessageUnpinned = (message: any) => {
      console.log('Message unpinned via socket:', message);
      
      // Format for Redux store
      const formattedMessageForStore = {
        _id: message._id,
        content: message.content,
        senderId: typeof message.senderId === 'object' 
          ? message.senderId 
          : { _id: message.senderId, username: 'User' },
        channelId: message.channelId,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        pinned: false,
        pinnedBy: undefined,
        mentions: message.mentions || [],
        replyTo: message.replyTo || null,
        attachment: message.attachment || null
      };
      
      // Update in Redux store
      dispatch(updateMessage(formattedMessageForStore));
      
      // Update in UI messages
      setAllMessages(prev => 
        prev.map(msg => 
          msg.id === message._id 
            ? {
                ...msg,
                pinned: false,
                timestamp: new Date(message.updatedAt).getTime()
              }
            : msg
        )
      );
    };
    
    // Register socket event listeners for the correct events from the server
    socket.on('message', handleNewMessage);
    socket.on('message_updated', handleMessageUpdated);
    socket.on('message_pinned', handleMessagePinned);
    socket.on('message_unpinned', handleMessageUnpinned);
    
    // Cleanup function to remove event listeners
    return () => {
      socket.off('message', handleNewMessage);
      socket.off('message_updated', handleMessageUpdated);
      socket.off('message_pinned', handleMessagePinned);
      socket.off('message_unpinned', handleMessageUnpinned);
    };
  }, [socket, dispatch]);
  
  const {
    data: messagesData,
    isLoading,
    isError
  } = useGetMessagesQuery({ 
    channelId: selectedChannelId || '',
    page,
    limit: 20
  }, {
    skip: !selectedChannelId
  });

  // Save current scroll position before new messages are loaded
  useEffect(() => {
    if (page > 1 && scrollableDivRef.current) {
      scrollHeightRef.current = scrollableDivRef.current.scrollHeight;
      scrollTopRef.current = scrollableDivRef.current.scrollTop;
    }
  }, [page]);

  // Update allMessages when new data is fetched
  useEffect(() => {
    if (messagesData?.messages) {
      const formattedMessages = messagesData.messages.map((msg: any) => {
        const formattedMessage: any = {
          id: msg._id,
          text: msg.content,
          senderId: typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId,
          senderName: typeof msg.senderId === 'object' ? msg.senderId.username : 'User',
          timestamp: new Date(msg.createdAt).getTime(),
          pinned: msg.pinned
        };
        
        // Add reply information if available
        if (msg.replyTo && msg.replyTo.messageId) {
          formattedMessage.replyTo = {
            id: msg.replyTo.messageId,
            text: msg.replyTo.content || '',
            senderId: msg.replyTo.senderId._id || '',
            senderName: msg.replyTo.senderId.username || 'User'
          };
        }
        
        // Add attachment information if available
        if (msg.attachment) {
          formattedMessage.attachment = {
            id: msg.attachment._id,
            url: msg.attachment.url,
            fileType: msg.attachment.fileType,
            fileName: msg.attachment.fileName,
            size: msg.attachment.size
          };
        }
        
        return formattedMessage;
      });

      // When it's the first page, replace allMessages, otherwise append to existing messages
      if (page === 1) {
        setAllMessages(formattedMessages);
        // No auto-scrolling on initial load or channel change
      } else {
        // Prepend older messages without scroll adjustment
        setAllMessages(prev => [...formattedMessages, ...prev]);
      }
      
      // Update hasMore based on pagination info
      if (messagesData.pagination) {
        setHasMore(messagesData.pagination.page < messagesData.pagination.totalPages);
      } else {
        setHasMore(false);
      }
    }
  }, [messagesData, selectedChannelId]);

  // Restore scroll position after loading older messages
  useEffect(() => {
    if (page > 1 && scrollableDivRef.current && messagesData?.messages) {
      const newScrollHeight = scrollableDivRef.current.scrollHeight;
      const heightDifference = newScrollHeight - scrollHeightRef.current;
      scrollableDivRef.current.scrollTop = scrollTopRef.current + heightDifference;
    }
  }, [messagesData, page]);

  // Function to load more messages
  const loadMoreMessages = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };
  
  // Function to scroll to bottom
  const scrollToBottom = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = 0;
    }
  };
  
  // Function to handle scroll events
  const handleScroll = () => {
    if (scrollableDivRef.current) {
      // Check if user is at bottom (remember flex-col-reverse means top is actually bottom)
      const isAtBottomNow = scrollableDivRef.current.scrollTop === 0;
      setIsAtBottom(isAtBottomNow);
    }
  };

  if (isLoading && page === 1) {
    return <div className="flex flex-col h-full justify-center items-center">Loading messages...</div>;
  }

  if (isError) {
    return <div className="flex flex-col h-full justify-center items-center text-red-500">Failed to load messages</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div 
        id="scrollableDiv"
        ref={scrollableDivRef}
        className="flex-1 overflow-y-auto px-4 pt-4 flex flex-col-reverse"
        onScroll={handleScroll}
      >
        <InfiniteScroll
          dataLength={allMessages.length}
          next={loadMoreMessages}
          hasMore={hasMore}
          loader={<div className="text-center p-2">Loading more messages...</div>}
          inverse={true}
          scrollableTarget="scrollableDiv"
          style={{ display: 'flex', flexDirection: 'column-reverse' }}
          endMessage={
            <div className="text-center p-2 text-gray-400">
              {allMessages.length > 0 ? "No more messages" : ""}
            </div>
          }
        >
          <MessageBody messages={allMessages} userId={userId} />
        </InfiniteScroll>
      </div>
      <ChatInput userId={userId} />
      {!isAtBottom && (
        <button 
          className="absolute bottom-20 right-8 bg-primary-500 text-white rounded-full p-2 shadow-lg"
          onClick={scrollToBottom}
          aria-label="Scroll to bottom"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L10 15.586l5.293-5.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWindow;
