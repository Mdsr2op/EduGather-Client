// ChatWindow.js
import { useEffect, useRef, useState, useCallback } from 'react';
import MessageBody from './MessageBody';
import ChatInput from './ChatInput';
import { useSelector } from 'react-redux';
import { selectSelectedChannelId } from '../../channels/slices/channelSlice';
import { useGetMessagesQuery } from '../../messages/slices/messagesApiSlice';
import { useSocket } from '@/lib/socket';
import InfiniteScroll from 'react-infinite-scroll-component';
import { formatMessageForUI } from '@/utils/messageFormatters';
import { useMessageSocketEvents } from '@/hooks/useMessageSocketEvents';

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
  
  // Use our centralized socket event handler hook
  useMessageSocketEvents(socket, selectedChannelId, setAllMessages);
  
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
    }
  }, [selectedChannelId, userId]);
  
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
        className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 flex flex-col-reverse"
        onScroll={handleScroll}
      >
        <InfiniteScroll
          dataLength={allMessages.length}
          next={loadMoreMessages}
          hasMore={hasMore}
          scrollThreshold={-1} // Disable automatic loading on scroll
          loader={
            <div className="flex justify-center items-center p-4">
              <button 
                onClick={loadMoreMessages}
                className="px-4 py-2 text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-2 bg-transparent"
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary-500"></div>
                    Loading...
                  </>
                ) : (
                  'Load More Messages'
                )}
              </button>
            </div>
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

// Export the function to be used by our hook
export const loadMoreMessagesGlobal = () => {
  if (globalLoadMoreMessagesRef) {
    globalLoadMoreMessagesRef();
    return true;
  }
  return false;
};

export default ChatWindow;
