import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import SearchResultItem from './SearchResultItem';
import { useSearchMessagesQuery } from '../../slices/messagesApiSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import useMessageNavigation from '../../hooks/useMessageNavigation';
import NavigationLoadingOverlay from '../navigation/NavigationLoadingOverlay';

interface SearchResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  searchQuery: string;
  channelId: string;
  groupId: string;
}

const SearchResultsDialog: React.FC<SearchResultsDialogProps> = ({
  open,
  onOpenChange,
  searchQuery,
  channelId,
  groupId,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { navigateToMessage, isSearching, loadingProgress, currentAttempt } = useMessageNavigation();
  
  // Use the RTK Query hook to search messages
  const { 
    data: searchResults, 
    isLoading, 
    isFetching,
    isError,
    error 
  } = useSearchMessagesQuery(
    { 
      channelId, 
      query: searchQuery,
      page: currentPage,
      limit: 10 // Smaller limit for dialog
    },
    { 
      skip: !searchQuery || !channelId || !open,
    }
  );
  
  // Convert API response to our component's expected format
  const results = searchResults?.messages?.map(message => ({
    _id: message._id,
    content: message.content,
    createdAt: message.createdAt,
    senderId: message.senderId,
    channelId: message.channelId,
    channelName: 'Channel', // This would ideally come from channel data
    groupId,
    groupName: 'Group' // This would ideally come from group data
  })) || [];

  const handleLoadMore = () => {
    if (searchResults?.pagination && currentPage < searchResults.pagination.totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handleNavigateToMessage = (messageId: string) => {
    // Navigate to the message
    navigateToMessage(messageId);
    
    // Close the dialog
    setTimeout(() => {
      onOpenChange(false);
    }, 10);
  };

  return (
    <>
      <NavigationLoadingOverlay 
        isVisible={isSearching} 
        progress={loadingProgress}
        currentAttempt={currentAttempt}
      />
      
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl w-full max-h-[80vh] p-0 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none overflow-hidden">
          <DialogHeader className="p-4 border-b border-dark-3 sticky top-0 bg-dark-4 z-10 flex flex-row items-center">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FiSearch className="text-primary-500" />
              <span>Search Results: {searchQuery}</span>
            </DialogTitle>
            <button 
              onClick={() => onOpenChange(false)} 
              className="ml-auto p-2 rounded-full hover:bg-dark-3 text-light-3 hover:text-light-1 transition-colors"
            >
              <FiX size={18} />
            </button>
          </DialogHeader>

          <div className="overflow-y-auto p-4 max-h-[calc(80vh-80px)]">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-40 text-light-3">
                <p className="text-lg text-red-500">Error searching messages</p>
                <p className="text-sm mt-2">{(error as any)?.data?.message || 'An unexpected error occurred'}</p>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-light-3">
                <FiSearch size={36} className="mb-4 text-light-4" />
                <p className="text-base">No messages found for "{searchQuery}"</p>
                <p className="text-sm mt-2">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-light-3 text-sm mb-4">
                  {searchResults?.pagination?.total || 0} message{searchResults?.pagination?.total !== 1 ? 's' : ''} found
                </p>
                
                {results.map((message) => (
                  <SearchResultItem 
                    key={message._id}
                    message={message}
                    onNavigate={() => handleNavigateToMessage(message._id)}
                  />
                ))}
                
                {/* Load more button */}
                {searchResults?.pagination && currentPage < searchResults.pagination.totalPages && (
                  <div className="flex justify-center mt-4">
                    <Button 
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={isFetching}
                      className="border-dark-5 text-light-1 hover:bg-dark-5 rounded-full px-4"
                    >
                      {isFetching ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchResultsDialog; 