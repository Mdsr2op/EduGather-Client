import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import SearchResultItem from '../components/search/SearchResultItem';
import { useSearchMessagesQuery } from '../slices/messagesApiSlice';
import { useSelector } from 'react-redux';
import { selectSelectedChannelId } from '../../channels/slices/channelSlice';
import { selectSelectedGroupId } from '../../groups/slices/groupSlice';

// Type definition - will be moved to a types file in real implementation
export interface SearchResultMessage {
  _id: string;
  content: string;
  createdAt: string;
  senderId: {
    _id: string;
    username: string;
    avatar?: string;
  };
  channelId: string;
  channelName: string;
  groupId: string;
  groupName: string;
}

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  // Get the current channel ID from Redux
  const selectedChannelId = useSelector(selectSelectedChannelId);
  const selectedGroupId = useSelector(selectSelectedGroupId);
  
  // Get search query from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search).get('query') || '';
    setSearchQuery(query);
  }, [location.search]);
  
  // Use the RTK Query hook to search messages
  const { 
    data: searchResults, 
    isLoading, 
    isFetching,
    isError,
    error 
  } = useSearchMessagesQuery(
    { 
      channelId: selectedChannelId || '', 
      query: searchQuery,
      page: currentPage,
      limit: 20
    },
    { 
      skip: !searchQuery || !selectedChannelId,
    }
  );
  
  // Convert API response to our component's expected format
  const results = searchResults?.messages?.map(message => ({
    _id: message._id,
    content: message.content,
    createdAt: message.createdAt,
    senderId: message.senderId,
    channelId: message.channelId,
    channelName: 'Channel', // This would need to be populated from channel data
    groupId: selectedGroupId || '',
    groupName: 'Group' // This would need to be populated from group data
  })) || [];

  const handleNavigateToMessage = (messageId: string, groupId: string, channelId: string) => {
    // Navigate to the message in its original context
    navigate(`/${groupId}/${channelId}?messageId=${messageId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleLoadMore = () => {
    if (searchResults?.pagination && currentPage < searchResults.pagination.totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-2 text-light-1">
      {/* Header */}
      <div className="p-4 border-b border-dark-4 bg-dark-3 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          className="mr-2 text-light-2 hover:text-light-1 hover:bg-dark-4"
        >
          <FiArrowLeft size={20} />
        </Button>
        <div className="flex items-center gap-2 text-xl font-semibold">
          <FiSearch className="text-primary-500" />
          <span>Search Results: {searchQuery}</span>
        </div>
      </div>

      {/* No channel selected message */}
      {!selectedChannelId && (
        <div className="flex flex-col items-center justify-center h-full text-light-3">
          <FiSearch size={48} className="mb-4 text-light-4" />
          <p className="text-lg">Please select a channel to search in</p>
        </div>
      )}

      {/* Search results */}
      {selectedChannelId && (
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading || isFetching ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center h-full text-light-3">
              <p className="text-lg text-red-500">Error searching messages</p>
              <p className="text-sm mt-2">{(error as any)?.data?.message || 'An unexpected error occurred'}</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-light-3">
              <FiSearch size={48} className="mb-4 text-light-4" />
              <p className="text-lg">No messages found for "{searchQuery}"</p>
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
                  onNavigate={handleNavigateToMessage}
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
      )}
    </div>
  );
};

export default SearchResultsPage; 