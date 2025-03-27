import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

/**
 * Hook to retrieve a Stream Video call by its ID
 * @param id - The ID of the call to retrieve
 * @returns Object containing the call and loading state
 */
export const useGetCallById = (id: string) => {
  const [call, setCall] = useState<Call | undefined>(undefined);
  const [isCallLoading, setIsCallLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client || !id) {
      setIsCallLoading(false);
      return;
    }
    
    const loadCall = async () => {
      try {
        // Query calls from Stream API using the provided ID
        const { calls } = await client.queryCalls({ 
          filter_conditions: { id: { $eq: id } } 
        });

        if (calls.length > 0) {
          setCall(calls[0]);
        } else {
          setError('Call not found');
        }
      } catch (error) {
        console.error('Error loading call:', error);
        setError('Failed to load call details');
      } finally {
        setIsCallLoading(false);
      }
    };

    setIsCallLoading(true);
    loadCall();
  }, [client, id]);

  return { call, isCallLoading, error };
};

export default useGetCallById; 