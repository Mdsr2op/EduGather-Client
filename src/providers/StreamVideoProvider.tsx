import { ReactNode, useEffect, useState, useCallback } from 'react';
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
  const { data: streamKeyData, error: streamKeyError } = useGetStreamKeyQuery();
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

  useEffect(() => {
    if (!user || !streamKeyData || !streamKeyData.success) {
      if (streamKeyError) {
        console.error('Failed to load Stream API key:', streamKeyError);
      }
      return;
    }

    const initClient = async () => {
      try {
        const API_KEY = streamKeyData.apiKey;
        
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

    // Cleanup function
    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [user, streamKeyData, streamKeyError, tokenProvider]);

  // Render with StreamVideo if client is available, otherwise just render children
  return videoClient ? (
    <StreamVideo client={videoClient}>{children}</StreamVideo>
  ) : (
    <>{children}</>
  );
};

export default StreamVideoProvider; 