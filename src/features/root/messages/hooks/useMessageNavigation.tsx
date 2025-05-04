import { useEffect, useState, useCallback, useRef } from 'react';
import { loadMoreMessagesGlobal } from '../../chats/components/ChatWindow';
import useScrollToElement from './useScrollToElement';
import { createPollingController } from '../utils/elementPolling';

// Configuration constants
const MAX_LOAD_ATTEMPTS = 10;

/**
 * Hook for navigating to specific messages in chat, loading older messages if needed
 */
const useMessageNavigation = () => {
  // State for UI feedback
  const [, setTargetMessageId] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // References to maintain across renders
  const abortControllerRef = useRef<AbortController | null>(null);
  const { scrollAndHighlight } = useScrollToElement();

  /**
   * Cleans up any ongoing search operations
   */
  const cleanupSearch = useCallback(() => {
    // Cancel any ongoing polling
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Reset UI state if needed
    if (isSearching) {
      setIsSearching(false);
    }
  }, [isSearching]);

  /**
   * Triggers the loading of more messages
   * @returns Boolean indicating if loading was triggered
   */
  const triggerLoadMoreMessages = useCallback((): boolean => {
    return loadMoreMessagesGlobal();
  }, []);

  /**
   * Searches for a message by ID, loading more messages if needed
   * @param messageId The ID of the message to find
   */
  const findAndNavigateToMessage = useCallback(async (messageId: string) => {
    // Cleanup any previous search
    cleanupSearch();
    
    // Initialize new search
    setTargetMessageId(messageId);
    setAttemptCount(0);
    setLoadingProgress(0);
    setIsSearching(true);
    
    const messageElementId = `message-${messageId}`;
    let currentAttempt = 0;
    
    // Try to load more messages until we find the target or reach max attempts
    while (currentAttempt < MAX_LOAD_ATTEMPTS) {
      // Update progress
      const progress = Math.min(90, (currentAttempt / MAX_LOAD_ATTEMPTS) * 100);
      setLoadingProgress(progress);
      setAttemptCount(currentAttempt);
      
      // Create new abort controller for this polling session
      abortControllerRef.current = createPollingController();
      
      // Check if message is already loaded
      const element = document.getElementById(messageElementId);
      if (element) {
        // Message found, scroll to it
        await scrollAndHighlight(element);
        setLoadingProgress(100);
        setIsSearching(false);
        return;
      }
      
      // Try to load more messages
      const loadTriggered = triggerLoadMoreMessages();
      if (!loadTriggered) {
        // Failed to load more messages, we've likely reached the end
        console.log("Unable to load more messages - may have reached the beginning of history");
        setLoadingProgress(100);
        setIsSearching(false);
        return;
      }
      
      // We need to wait for messages to load
      // Give more time for the loading to complete (loading spinner is visible to the user)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const foundElement = document.getElementById(messageElementId);
      if (foundElement) {
        // Message found after loading, scroll to it
        await scrollAndHighlight(foundElement);
        setLoadingProgress(100);
        setIsSearching(false);
        return;
      }
      
      // Increment attempt counter and try again
      currentAttempt++;
    }
    
    // If we get here, we've reached max attempts without finding the message
    console.warn(`Could not find message ${messageId} after ${MAX_LOAD_ATTEMPTS} attempts`);
    setLoadingProgress(100);
    setIsSearching(false);
  }, [cleanupSearch, triggerLoadMoreMessages, scrollAndHighlight]);

  /**
   * Initiates navigation to a specific message
   * @param messageId The ID of the message to navigate to
   */
  const navigateToMessage = useCallback((messageId: string) => {
    // Start a new search - use timeout to ensure any state updates are processed
    setTimeout(() => {
      findAndNavigateToMessage(messageId);
    }, 50);
  }, [findAndNavigateToMessage]);

  // Cleanup on unmount or when dependencies change
  useEffect(() => {
    return () => cleanupSearch();
  }, [cleanupSearch]);

  return { 
    navigateToMessage, 
    isSearching, 
    loadingProgress,
    currentAttempt: attemptCount 
  };
};

export default useMessageNavigation; 