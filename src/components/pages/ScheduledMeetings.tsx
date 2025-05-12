// src/components/pages/ScheduledMeetings.tsx
import ScheduledMeetingCard from "@/features/root/groups/components/ScheduledMeetingCard";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGetCalls, ExtendedCall } from "@/hooks/useGetCalls";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";
import { FiCalendar, FiPlus } from "react-icons/fi";

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
    <div className="p-3 sm:p-6 bg-dark-2 text-light-1 h-full overflow-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-dark-4 to-dark-3 rounded-2xl p-6 sm:p-8 mb-6 shadow-lg border border-dark-5"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-light-1 mb-2 flex items-center gap-2">
                <FiCalendar className="text-primary-500" size={28} />
                Scheduled Meetings
              </h1>
              <p className="text-light-3 text-sm sm:text-base max-w-xl">
                View and manage your upcoming meetings and collaborate with your teams
              </p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-light-1 px-5 py-3 rounded-xl transition-colors shadow-md w-full sm:w-auto"
            >
              <FiPlus size={18} />
              <span className="font-medium">Schedule Meeting</span>
            </motion.button>
          </div>
          
          {/* Calendar strip */}
          <div className="mt-6 overflow-x-auto custom-scrollbar-horizontal">
            <div className="flex gap-2 min-w-max py-2">
              {Array.from({ length: 7 }).map((_, index) => {
                const date = new Date();
                date.setDate(date.getDate() + index);
                const isToday = index === 0;
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = date.getDate();
                
                return (
                  <div 
                    key={index}
                    className={`flex flex-col items-center p-3 rounded-xl min-w-[70px] cursor-pointer 
                      ${isToday 
                        ? 'bg-primary-500 text-light-1' 
                        : 'bg-dark-4/70 text-light-2 hover:bg-dark-5'}`}
                  >
                    <span className="text-xs opacity-80">{day}</span>
                    <span className="text-lg font-bold">{dayNum}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
        
        {/* Main Content */}
        <div className="relative min-h-[200px]">
          {isLoadingData ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col justify-center items-center py-16"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-light-3 animate-pulse">Loading scheduled meetings...</p>
            </motion.div>
          ) : meetings.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-xl font-semibold text-light-1">Upcoming Meetings</h2>
                <div className="flex items-center gap-2 text-sm text-light-3">
                  <span>Sort by:</span>
                  <select className="bg-dark-3 text-light-2 rounded-xl border border-dark-4 py-1 px-2 text-sm">
                    <option value="soon">Starting Soon</option>
                    <option value="latest">Latest Added</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {meetings.map((meeting, index) => (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ScheduledMeetingCard meeting={meeting} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center p-10 bg-dark-3 rounded-xl border border-dark-5 shadow-sm flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-dark-4 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCalendar className="text-light-3" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-light-1 mb-2">No Scheduled Meetings</h3>
              <p className="text-light-3 mb-6 max-w-md">
                You don't have any upcoming meetings. Create one to collaborate with your teams.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-light-1 rounded-xl flex items-center gap-2 shadow-md"
              >
                <FiPlus size={16} />
                <span>Schedule a Meeting</span>
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduledMeetings;
