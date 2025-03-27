import { ReactNode, useEffect, useState } from 'react';
import { StreamVideoClient, StreamVideo } from '@stream-io/video-react-sdk';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';
import axios from 'axios';

// Create a token provider function to get tokens from the backend
const tokenProvider = async () => {
  try {
    const response = await axios.get('/api/v1/stream/token');
    if (response.data.success) {
      return response.data.token;
    }
    throw new Error('Failed to get Stream token');
  } catch (error) {
    console.error('Error getting Stream token:', error);
    throw error;
  }
};

interface StreamVideoProviderProps {
  children: ReactNode;
}

const StreamVideoProvider = ({ children }: StreamVideoProviderProps) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const initClient = async () => {
      try {
        setIsLoading(true);
        
        // Fetch the API key from the backend
        const apiKeyResponse = await axios.get('/api/v1/stream/key');
        if (!apiKeyResponse.data.success || !apiKeyResponse.data.apiKey) {
          throw new Error('Failed to get Stream API key');
        }
        
        const API_KEY = apiKeyResponse.data.apiKey;
        
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
        setError(null);
      } catch (error) {
        console.error('Failed to initialize Stream client:', error);
        setError('Failed to initialize video chat. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    initClient();

    // Cleanup function
    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [user]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading video client...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!videoClient) {
    return <div className="text-gray-500">Video client not available</div>;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider; 