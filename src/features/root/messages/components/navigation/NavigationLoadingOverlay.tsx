import React from 'react';
import { FaSpinner } from 'react-icons/fa';

interface NavigationLoadingOverlayProps {
  isVisible: boolean;
  progress: number;
  currentAttempt: number;
  maxAttempts?: number;
}

/**
 * Loading overlay displayed during message navigation
 */
const NavigationLoadingOverlay: React.FC<NavigationLoadingOverlayProps> = ({
  isVisible,
  progress,
  currentAttempt,
  maxAttempts = 10
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-dark-2 rounded-lg p-6 flex flex-col items-center w-80">
        <FaSpinner className="animate-spin text-primary-500 text-3xl mb-3" />
        <p className="text-light-1 font-medium text-lg">Navigating to message...</p>
        
        <div className="w-full mt-4 mb-2">
          <div className="h-2 w-full bg-dark-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-300 ease-in-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <p className="text-light-3 text-sm">
          {currentAttempt > 0 
            ? `Loading older messages (attempt ${currentAttempt}/${maxAttempts})...` 
            : 'Searching for message...'}
        </p>
      </div>
    </div>
  );
};

export default NavigationLoadingOverlay; 