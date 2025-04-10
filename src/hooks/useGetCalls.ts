import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

export type MeetingStatus = "scheduled" | "ongoing" | "ended";

export interface ExtendedCall extends Call {
  derivedStatus?: MeetingStatus;
}

export interface CallsOptions {
  status?: MeetingStatus | "all";
  limit?: number;
  sortDirection?: 1 | -1;
  userId?: string;
}

export const useGetCalls = (options: CallsOptions = {}) => {
  const {
    status = "scheduled",
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

        switch (status) {
          case "scheduled":
            filterConditions = {
              starts_at: { $gt: now },
              ended_at: { $exists: false },
            };
            break;
          case "ongoing":
            filterConditions = {
              starts_at: { $lt: now },
              ended_at: { $exists: false },
            };
            break;
          case "ended":
            filterConditions = {
              ended_at: { $exists: true },
            };
            break;
          case "all":
            // No specific filter for 'all'
            break;
        }

        const response = await client.queryCalls({
          filter_conditions: filterConditions,
          sort: [{ field: "starts_at", direction: sortDirection }],
          limit,
        });

        if (response.calls) {
          let processedCalls = response.calls as ExtendedCall[];

          // Client-side filtering based on custom fields
          if (userId) {
            processedCalls = processedCalls.filter((call) => {
              const memberIds = call.state.custom?.memberIds || [];
              const createdBy = call.state.custom?.createdBy;
              return createdBy === userId || memberIds.includes(userId);
            });
          }

          // Map Stream call states to meeting statuses
          processedCalls = processedCalls.map((call) => {
            const now = new Date();
            const startTime = call.state.startsAt
              ? new Date(call.state.startsAt)
              : null;

            if (call.state.endedAt) {
              call.derivedStatus = "ended";
            } else if (startTime && startTime <= now) {
              call.derivedStatus = "ongoing";
            } else {
              call.derivedStatus = "scheduled";
            }

            return call;
          });

          setCalls(processedCalls);
        }
      } catch (error) {
        console.error("Error loading calls:", error);
        setError("Failed to load meetings");
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
