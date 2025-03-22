import React, { createContext, useContext } from 'react';
import { useStreamInit } from '../hooks/useStreamInit';

// Simple context to provide Stream initialization status
interface StreamContextType {
  isLoading: boolean;
  isInitialized: boolean;
  apiKey: string | null;
  token: string | null;
}

const StreamContext = createContext<StreamContextType>({
  isLoading: false,
  isInitialized: false,
  apiKey: null,
  token: null,
});

// Provider component for Stream
interface StreamProviderProps {
  children: React.ReactNode;
}

export const StreamProvider: React.FC<StreamProviderProps> = ({ children }) => {
  // Initialize Stream
  const streamState = useStreamInit();
  
  return (
    <StreamContext.Provider value={streamState}>
      {children}
    </StreamContext.Provider>
  );
};

// Custom hook to access Stream state
export const useStreamClient = () => useContext(StreamContext); 