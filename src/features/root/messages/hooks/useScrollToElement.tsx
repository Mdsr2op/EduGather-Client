import { useCallback } from 'react';

/**
 * Hook for scrolling to and highlighting DOM elements
 */
const useScrollToElement = () => {
  /**
   * Scrolls to an element and temporarily highlights it
   * @param element - The DOM element to scroll to
   * @param highlightDuration - Duration of highlight effect in ms (default: 2000)
   * @param highlightColor - Background color for highlight (default: rgba(234, 179, 8, 0.2))
   * @returns Promise that resolves when scrolling and highlighting are complete
   */
  const scrollAndHighlight = useCallback((
    element: HTMLElement, 
    highlightDuration = 2000,
    highlightColor = 'rgba(234, 179, 8, 0.2)'
  ): Promise<void> => {
    return new Promise((resolve) => {
      // Apply highlight
      element.style.backgroundColor = highlightColor;
      
      // Scroll to element
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Remove highlight after duration
      setTimeout(() => {
        // Check if element still exists before removing style
        if (document.getElementById(element.id)) {
          element.style.backgroundColor = '';
        }
        resolve();
      }, highlightDuration);
    });
  }, []);

  return { scrollAndHighlight };
};

export default useScrollToElement; 