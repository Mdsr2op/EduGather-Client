import React, { useEffect, createContext, useContext, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { StreamVideoClient } from '@stream-io/video-react-sdk';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';
import { useStreamInit } from '../hooks/useStreamInit';

// Create a context for the Stream Video client
interface StreamContextType {
  client: StreamVideoClient | null;
  isLoading: boolean;
}

const StreamContext = createContext<StreamContextType>({
  client: null,
  isLoading: false,
});

// Provider component for Stream Video client
interface StreamProviderProps {
  children: ReactNode;
}

export const StreamProvider: React.FC<StreamProviderProps> = ({ children }) => {
  const [client, setClient] = React.useState<StreamVideoClient | null>(null);
  const currentUser = useSelector(selectCurrentUser);
  const { apiKey, token, isLoading } = useStreamInit();
  
  // Initialize the Stream Video client when API key and token are available
  useEffect(() => {
    let videoClient: StreamVideoClient | null = null;
    
    const initClient = async () => {
      if (apiKey && token && currentUser && !client) {
        try {
          // Initialize the Stream Video client
          videoClient = new StreamVideoClient({
            apiKey,
            user: {
              id: currentUser._id,
              name: currentUser.fullName,
              image: currentUser.avatarUrl,
            },
            token,
          });
          
          // Set the client in state
          setClient(videoClient);
          console.log('Stream Video client connected successfully');
        } catch (error) {
          console.error('Error connecting to Stream Video:', error);
          if (videoClient) {
            videoClient.disconnectUser();
          }
        }
      }
    };
    
    if (!client && apiKey && token && currentUser) {
      initClient();
    }
    
    // Cleanup function to disconnect the Stream client
    return () => {
      if (client) {
        client.disconnectUser().then(() => {
          console.log('Stream Video client disconnected');
          setClient(null);
        });
      }
    };
  }, [apiKey, token, currentUser, client]);
  
  // Disconnect the user when they log out
  useEffect(() => {
    if (!currentUser && client) {
      client.disconnectUser().then(() => {
        console.log('Stream Video client disconnected due to user logout');
        setClient(null);
      });
    }
  }, [currentUser, client]);
  
  return (
    <StreamContext.Provider value={{ client, isLoading }}>
      {children}
    </StreamContext.Provider>
  );
};

// Custom hook to use the Stream Video client
export const useStreamClient = () => useContext(StreamContext); 