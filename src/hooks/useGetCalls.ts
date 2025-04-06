import { useEffect, useState } from 'react';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';

// Use the same status types as in the rest of the codebase
export type MeetingStatus = 'scheduled' | 'ongoing' | 'ended';

// Define an extended call type that includes our derived status
export interface ExtendedCall extends Call {
  derivedStatus?: MeetingStatus;
}

export interface CallsOptions {
  status?: MeetingStatus | 'all'; // Add 'all' as a possible value for filtering
  limit?: number;
  sortDirection?: 1 | -1; // 1 for ascending, -1 for descending
  userId?: string; // Filter by user ID
}

/**
 * Hook to retrieve meetings (calls) from Stream Video API
 * @param options - Options for filtering and sorting calls
 * @returns Object containing the calls, loading state, and error
 */
export const useGetCalls = (options: CallsOptions = {}) => {
  const {
    status = 'scheduled', // Default to scheduled meetings
    limit = 10,
    sortDirection = 1,
    userId,
  } = options;

  const [calls, setCalls] = useState<ExtendedCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) {
      setIsLoading(false);
      return;
    }

    const loadCalls = async () => {
      try {
        const now = new Date().toISOString();
        let filterConditions: Record<string, any> = {};
        
        // Set filter conditions based on the meeting status
        switch (status) {
          case 'scheduled':
            filterConditions = {
              starts_at: { $gt: now }, // Calls with start time greater than now
              ended_at: { $exists: false }, // Calls that haven't ended
              $or: [
                { created_by_user_id: userId },
                { members: { $in: [userId] } },
              ],
            };
            break;
          case 'ongoing':
            filterConditions = {
              starts_at: { $lt: now }, // Started in the past
              ended_at: { $exists: false }, // But hasn't ended yet
            };
            break;
          case 'ended':
            filterConditions = {
              ended_at: { $exists: true }, // Calls that have ended
            };
            break;
          case 'all':
            // No specific filter for 'all'
            break;
        }
        
        // Add user filter if provided
        // if (userId) {
        //   filterConditions.members = { $in: [userId] };
        // }

        // Query calls from Stream API
        const response = await client.queryCalls({
          filter_conditions: filterConditions,
          sort: [{ field: 'starts_at', direction: sortDirection }], // Sort by start time
          limit,
        });

        if (response.calls) {
          // Process calls based on status
          let processedCalls = response.calls.filter(
            call => call.state.custom && call.state.custom.description
          ) as ExtendedCall[];
          
          // Map Stream call states to our application's meeting statuses
          // This ensures the calls returned match the expected status
          processedCalls = processedCalls.map(call => {
            // Add a derived property to easily identify status
            const now = new Date();
            const startTime = call.state.startsAt ? new Date(call.state.startsAt) : null;
            
            // Instead of modifying the read-only custom property,
            // we'll add a new top-level property to our extended call type
            if (call.state.endedAt) {
              call.derivedStatus = 'ended';
            } else if (startTime && startTime <= now) {
              call.derivedStatus = 'ongoing';
            } else {
              call.derivedStatus = 'scheduled';
            }
            
            return call;
          });
          
          setCalls(processedCalls);
        }
      } catch (error) {
        console.error('Error loading calls:', error);
        setError('Failed to load meetings');
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    loadCalls();
  }, [client, status, limit, sortDirection, userId]);

  return { calls, isLoading, error };
};

export default useGetCalls; 