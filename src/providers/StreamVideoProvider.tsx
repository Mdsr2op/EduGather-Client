import { ReactNode, useEffect, useState, useCallback, useRef } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';
import { useGetStreamKeyQuery, useFetchStreamTokenMutation } from '@/features/root/stream/slices/streamApiSlice';

interface StreamVideoProviderProps {
  children: ReactNode;
}

const StreamVideoProvider = ({ children }: StreamVideoProviderProps) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const user = useSelector(selectCurrentUser);
  // Store current user ID in a ref to track changes
  const currentUserIdRef = useRef<string | null>(null);
  
  // Use refetch to manually trigger refetching stream key when user logs in
  const { data: streamKeyData, error: streamKeyError, refetch: refetchStreamKey } = useGetStreamKeyQuery(undefined, {
    // Skip query if no user is logged in
    skip: !user
  });
  const [fetchToken] = useFetchStreamTokenMutation();
  
  // Create a token provider that uses the RTK Query mutation
  const tokenProvider = useCallback(async () => {
    try {
      const response = await fetchToken().unwrap();
      if (response.success) {
        return response.token;
      }
      throw new Error('Failed to get Stream token');
    } catch (error) {
      console.error('Error getting Stream token:', error);
      throw error;
    }
  }, [fetchToken]);

  // Cleanup and initialize client whenever user changes
  useEffect(() => {
    // If user ID changed (including from null to a value or vice versa)
    const userChanged = user?._id !== currentUserIdRef.current;
    
    // Update the ref to current user ID
    currentUserIdRef.current = user?._id || null;
    
    // If user not logged in, clean up any existing client
    if (!user) {
      if (videoClient) {
        console.log('User logged out, disconnecting video client');
        videoClient.disconnectUser();
        setVideoClient(null);
      }
      return;
    }
    
    // If user logged in but we don't have stream key data yet, refetch it
    if (user && !streamKeyData) {
      refetchStreamKey();
      return;
    }
    
    // Check if we have the necessary data to initialize
    if (!streamKeyData || !streamKeyData.success) {
      if (streamKeyError) {
        console.error('Failed to load Stream API key:', streamKeyError);
      }
      return;
    }
    
    // Skip initialization if user hasn't changed and we already have a client
    if (!userChanged && videoClient) {
      return;
    }

    // Initialize client for the current user
    const initClient = async () => {
      try {
        console.log('Initializing Stream video client for user:', user.username);
        const API_KEY = streamKeyData.apiKey;
        
        // Clean up any existing client before creating a new one
        if (videoClient) {
          await videoClient.disconnectUser();
        }
        
        // Create a new StreamVideoClient
        const client = new StreamVideoClient({
          apiKey: API_KEY,
          user: {
            id: user._id,
            name: user.username || user._id,
            image: user.avatarUrl,
          },
          tokenProvider,
        });

        setVideoClient(client);
      } catch (error) {
        console.error('Failed to initialize Stream client:', error);
      }
    };

    initClient();
    
  }, [user, streamKeyData, streamKeyError, tokenProvider, refetchStreamKey, videoClient]);

  // Render with StreamVideo if client is available, otherwise just render children
  return videoClient ? (
    <StreamVideo client={videoClient}>{children}</StreamVideo>
  ) : (
    <>{children}</>
  );
};

export default StreamVideoProvider; 