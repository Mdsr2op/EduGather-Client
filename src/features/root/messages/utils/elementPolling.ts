/**
 * Polls for an element in the DOM until it's found or max attempts are reached
 * @param elementId - The ID of the element to find
 * @param options - Polling configuration options
 * @returns Promise that resolves with the found element or null if not found
 */
export const pollForElement = (
  elementId: string,
  options: {
    interval?: number;     // Time between checks in ms (default: 200)
    maxDuration?: number;  // Maximum duration to poll in ms (default: 3000)
    signal?: AbortSignal;  // Optional AbortSignal to cancel polling
  } = {}
): Promise<HTMLElement | null> => {
  const { 
    interval = 200, 
    maxDuration = 3000,
    signal 
  } = options;
  
  return new Promise((resolve) => {
    const maxAttempts = Math.ceil(maxDuration / interval);
    let attempts = 0;
    
    // Function to check for element
    const checkForElement = () => {
      // Check if aborted
      if (signal?.aborted) {
        resolve(null);
        return;
      }
      
      // Try to find element
      const element = document.getElementById(elementId);
      if (element) {
        // Element found
        resolve(element);
        return;
      }
      
      // Check if we've reached max attempts
      attempts++;
      if (attempts >= maxAttempts) {
        // Give up after max attempts
        resolve(null);
        return;
      }
      
      // Schedule next check
      setTimeout(checkForElement, interval);
    };
    
    // Start checking
    checkForElement();
  });
};

/**
 * Creates an AbortController for cancelling element polling
 * @returns An AbortController instance
 */
export const createPollingController = (): AbortController => {
  return new AbortController();
}; 