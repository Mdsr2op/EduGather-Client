// ChatWindow.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBody from './MessageBody';
import ChatInput from './ChatInput';
import { useSelector } from 'react-redux';
import { selectSelectedChannelId } from '../../channels/slices/channelSlice';
import { useGetMessagesQuery } from '../../messages/slices/messagesApiSlice';
import { useSocket } from '@/lib/socket';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatMessageForUI } from '@/utils/messageFormatters';
import { useMessageSocketEvents } from '@/hooks/useMessageSocketEvents';
import { FiChevronDown, FiRefreshCw } from 'react-icons/fi';

interface ChatWindowProps {
  userId: string;
}

// Create a global reference to the loadMoreMessages function that our hook can access
let globalLoadMoreMessagesRef: (() => void) | null = null;

const ChatWindow = ({ userId }: ChatWindowProps) => {
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
  
  // Flag to prevent initial scroll animation
  const initialLoadRef = useRef<boolean>(true);
  
  // State to track last visible message ID before loading more
  const [lastVisibleMessageId, setLastVisibleMessageId] = useState<string | null>(null);
  
  // State to track loading state for the "Load More Messages" button
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const {
    data: messagesData,
    isLoading,
    isError,
    refetch
  } = useGetMessagesQuery({ 
    channelId: selectedChannelId || '',
    page,
    limit: 20
  }, {
    skip: !selectedChannelId
  });
  
  // Use our centralized socket event handler hook
  useMessageSocketEvents(socket, selectedChannelId, setAllMessages, refetch);
  
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
      initialLoadRef.current = true;
      
      // Fetch messages from database when channel changes
      if (selectedChannelId) {
        refetch();
      }
    }
  }, [selectedChannelId, userId, refetch]);

  // Function to load more messages
  const loadMoreMessages = useCallback(() => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      
      // Save the ID of the first message currently in view (which is the latest loaded message)
      if (allMessages.length > 0) {
        setLastVisibleMessageId(allMessages[0].id);
      }
      
      setPage(prevPage => prevPage + 1);
    }
  }, [hasMore, isLoadingMore, allMessages]);
  
  // Make loadMoreMessages available globally for the useMessageNavigation hook
  useEffect(() => {
    globalLoadMoreMessagesRef = loadMoreMessages;
    return () => {
      globalLoadMoreMessagesRef = null;
    };
  }, [loadMoreMessages]);
  
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

  // Update allMessages when new data is fetched
  useEffect(() => {
    if (messagesData?.messages) {
      const formattedMessages = messagesData.messages.map((msg: any) => formatMessageForUI(msg));

      // When it's the first page, replace allMessages, otherwise append to existing messages
      if (page === 1) {
        setAllMessages(formattedMessages);
        
        // This is the initial load, we'll handle scrolling directly in the rendered component
        initialLoadRef.current = true;
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
      
      // Set loading state to false once messages are loaded
      setIsLoadingMore(false);
    }
  }, [messagesData, selectedChannelId]);

  // Make sure we're at the bottom after initial render
  useEffect(() => {
    if (initialLoadRef.current && allMessages.length > 0 && scrollableDivRef.current) {
      // For initial load, force scroll to bottom (latest messages)
      // Using setTimeout to ensure the DOM is fully rendered
      setTimeout(() => {
        if (scrollableDivRef.current) {
          scrollableDivRef.current.scrollTop = 0;
          initialLoadRef.current = false;
        }
      }, 0);
    }
  }, [allMessages]);
  
  // Scroll to the last visible message after loading more messages
  useEffect(() => {
    if (!isLoadingMore && lastVisibleMessageId && page > 1) {
      // Need to wait a tick for the DOM to update
      setTimeout(() => {
        const messageElement = document.getElementById(`message-${lastVisibleMessageId}`);
        if (messageElement && scrollableDivRef.current) {
          // Simply scroll the element into view
          messageElement.scrollIntoView({ block: 'start', behavior: 'auto' });
          
          // Reset the last visible message ID
          setLastVisibleMessageId(null);
        }
      }, 100);
    }
  }, [isLoadingMore, lastVisibleMessageId, page]);

  if (isLoading && page === 1) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-full justify-center items-center text-light-3"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p className="animate-pulse">Loading messages...</p>
      </motion.div>
    );
  }

  if (isError) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col h-full justify-center items-center text-red-500 p-6"
      >
        <div className="mb-4 w-16 h-16 rounded-full bg-dark-4 flex items-center justify-center text-red-500">
          <FiRefreshCw size={24} />
        </div>
        <p className="mb-4 text-lg">Failed to load messages</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => refetch()}
          className="px-4 py-2 bg-dark-4 hover:bg-dark-5 text-light-1 rounded-xl flex items-center gap-2"
        >
          <FiRefreshCw size={16} />
          <span>Retry</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div 
        id="scrollableDiv"
        ref={scrollableDivRef}
        className="flex-1 overflow-y-auto custom-scrollbar px-2 sm:px-4 pt-2 sm:pt-4 flex flex-col-reverse bg-dark-3 rounded-xl"
        onScroll={handleScroll}
      >
        <InfiniteScroll
          dataLength={allMessages.length}
          next={loadMoreMessages}
          hasMore={hasMore}
          scrollThreshold={-1}
          loader={
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center items-center p-2 sm:p-4"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadMoreMessages}
                className="px-3 sm:px-4 py-2 bg-dark-4 hover:bg-dark-5 text-primary-500 hover:text-primary-400 transition-colors rounded-xl flex items-center gap-1.5 sm:gap-2 shadow-sm"
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-500"></div>
                    <span>Loading history...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 4h18M3 12h18M3 20h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Load More Messages</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          }
          inverse={true}
          scrollableTarget="scrollableDiv"
          className="flex flex-col-reverse"
          endMessage={<></>}
        >
          <MessageBody 
            messages={allMessages} 
            userId={userId}
            initialLoad={initialLoadRef.current}
          />
        </InfiniteScroll>
      </div>
      <ChatInput userId={userId} />
      <AnimatePresence>
        {!isAtBottom && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="fixed bottom-20 right-6 sm:right-8 bg-primary-500 text-white rounded-full w-10 h-10 shadow-lg z-10 flex items-center justify-center"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            <FiChevronDown size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

// Export the function to be used by our hook
export const loadMoreMessagesGlobal = () => {
  if (globalLoadMoreMessagesRef) {
    globalLoadMoreMessagesRef();
    return true;
  }
  return false;
};

export default ChatWindow;
