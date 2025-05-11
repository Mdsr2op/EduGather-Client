// src/components/pages/ScheduledMeetings.tsx
import ScheduledMeetingCard from "@/features/root/groups/components/ScheduledMeetingCard";
import React, { useEffect, useState } from "react";
import { useGetCalls, ExtendedCall } from "@/hooks/useGetCalls";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";

// Define the Meeting interface here to ensure both components use the exact same type
export interface Meeting {
  id: number | string;
  title: string;
  date: string;
  time: string;
  organizer: string;
  channel: string;
  agenda: string;
  startingIn: string;
  group: string;
  groupId: string;
  channelId: string;
}

// Helper function to format dates and calculate the "starting in" time
const formatMeetingTime = (startTime: string | Date | null): string => {
  if (!startTime) return "N/A";
  
  const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
  const now = new Date();
  const diffMs = start.getTime() - now.getTime();
  
  // If time is in the past, return 'Starting now'
  if (diffMs <= 0) return "Starting now";
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) return `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  if (diffHours > 0) return `about ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
  return "less than a minute";
};

// Format a date object to a readable date string
const formatDateString = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Format a date object to a readable time string
const formatTimeString = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Convert Stream ExtendedCall to our Meeting interface
const convertStreamCallToMeeting = (call: ExtendedCall): Meeting => {
  const startTime = call.state.startsAt ? new Date(call.state.startsAt) : null;
  const createdBy = call.state.createdBy?.name || "Unknown";
  const custom = call.state.custom || {};
  console.log('[convertStreamCallToMeeting] Call:', call.state.custom);
  return {
    id: call.id,
    title: custom.description || "Untitled Meeting",
    date: startTime ? formatDateString(startTime) : "TBD",
    time: startTime ? formatTimeString(startTime) : "TBD",
    organizer: createdBy || "Unknown",
    channel: custom.channelName || "General",
    agenda: custom.agenda || "No agenda provided",
    startingIn: formatMeetingTime(startTime),
    group: custom.groupName || "General",
    groupId: custom.groupId || "General",
    channelId: custom.channelId || "General"
  };
};

const ScheduledMeetings: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  // Get the current user from the Redux store
  const user = useSelector(selectCurrentUser);
  const userId = user?._id; // Use _id from the User interface
  const [isLoadingData, setIsLoadingData] = useState(true); // To control our own loading state
  
  // Fetch meetings using useGetCalls hook
  const { calls, isLoading, error } = useGetCalls({
    status: 'scheduled',
    limit: 20,
    sortDirection: 1, // ascending by start time
    userId: userId
  });
  
  // Convert calls to meetings format when calls are loaded
  useEffect(() => {
    setIsLoadingData(isLoading);
    
    if (!isLoading) {
      if (calls && calls.length > 0) {
        try {
          const convertedMeetings = calls.map(convertStreamCallToMeeting);
          setMeetings(convertedMeetings);
        } catch (err) {
          console.error("Error converting meeting data:", err);
          setMeetings([]);
        }
      } else {
        // No meetings found or there was an error
        setMeetings([]);
      }
      
      setIsLoadingData(false);
    }
  }, [calls, isLoading, error]);

  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto bg-dark-2 pt-16">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-light-1 mb-2 sm:mb-3 md:mb-4">Scheduled Meetings</h2>
      
      {isLoadingData ? (
        <div className="text-light-3 text-center py-4 sm:py-6 md:py-8">
          <div className="animate-spin rounded-xl h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-primary-500 mx-auto mb-2"></div>
          <p className="text-sm sm:text-base">Loading scheduled meetings...</p>
        </div>
      ) : meetings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {meetings.map((meeting) => (
            <ScheduledMeetingCard key={meeting.id} meeting={meeting} />
          ))}
        </div>
      ) : (
        <div className="text-light-3 text-center p-4 sm:p-6 md:p-8 bg-dark-3 rounded-xl border border-dark-5">
          <p className="text-sm sm:text-base md:text-lg mb-2">No scheduled meetings found.</p>
          <p className="text-xs sm:text-sm">Create a new meeting to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ScheduledMeetings;
