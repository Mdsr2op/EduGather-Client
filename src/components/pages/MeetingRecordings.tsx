// src/components/pages/MeetingRecordings.tsx
import MeetingRecordingCard from "@/features/root/groups/components/MeetingRecordingCard";
import React, { useEffect, useState } from "react";
import { useGetCalls } from "@/hooks/useGetCalls";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";
import { CallRecording } from "@stream-io/video-react-sdk";

// Extend the CallRecording type with the properties we need
interface ExtendedCallRecording extends CallRecording {
  duration?: number;
  size?: number;
}

// Update to match the existing implementation in MeetingRecordingCard
export interface Recording {
  id: number;  // Changed to only number to match MeetingRecordingCard expectations
  title: string;
  date: string;
  fileName: string;
  url: string; // URL to the recording file
  duration?: string;
  size?: string;
}

// Convert Stream CallRecording to our Recording interface
const convertStreamRecordingToRecording = (recording: CallRecording): Recording => {
  // Cast to extended type to access potential properties
  const extendedRecording = recording as ExtendedCallRecording;
  
  // Generate a numeric ID
  const numericId = typeof recording.filename === 'string' ? 
    parseInt(recording.filename.replace(/\D/g, '').substring(0, 9), 10) || Math.floor(Math.random() * 100000) :
    Math.floor(Math.random() * 100000);
    
  return {
    id: numericId,
    title: recording.filename?.substring(0, 50) || "Unnamed Recording",
    date: recording.start_time ? new Date(recording.start_time).toLocaleDateString() : "Unknown date",
    fileName: recording.filename || "recording.mp4",
    url: recording.url || "",
    duration: extendedRecording.duration ? 
      `${Math.floor(extendedRecording.duration / 60)}m ${Math.floor(extendedRecording.duration % 60)}s` : "Unknown",
    size: extendedRecording.size ? 
      `${(extendedRecording.size / (1024 * 1024)).toFixed(1)} MB` : "Unknown"
  };
};

const MeetingRecordings: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  // Get the current user from the Redux store
  const user = useSelector(selectCurrentUser);
  const userId = user?._id;

  // Fetch recordings using useGetCalls hook (with ended status to get calls that might have recordings)
  const { calls, isLoading, error } = useGetCalls({
    status: 'ended',
    limit: 20,
    sortDirection: -1, // descending by end time (most recent first)
    userId: userId
  });

  useEffect(() => {
    const fetchRecordings = async () => {
      if (!calls || calls.length === 0) {
        setRecordings([]);
        setIsLoadingData(false);
        return;
      }

      try {
        // Query recordings for each call
        const recordingsPromises = calls.map(call => call.queryRecordings());
        const callsWithRecordings = await Promise.all(recordingsPromises);
        
        // Get all recordings from all calls and flatten the array
        const allRecordings = callsWithRecordings
          .filter(callData => callData && callData.recordings && callData.recordings.length > 0)
          .flatMap(callData => callData.recordings);

        // Convert to our Recording format
        const formattedRecordings = allRecordings.map(convertStreamRecordingToRecording);
        setRecordings(formattedRecordings);
      } catch (err) {
        console.error("Error fetching or processing recordings:", err);
        setRecordings([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (!isLoading) {
      fetchRecordings();
    }
  }, [calls, isLoading]);

  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto bg-dark-2 pt-16">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-light-1 mb-2 sm:mb-3 md:mb-4">Meeting Recordings</h2>
      
      {isLoadingData ? (
        <div className="text-light-3 text-center py-4 sm:py-6 md:py-8">
          <div className="animate-spin rounded-xl h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-primary-500 mx-auto mb-2"></div>
          <p className="text-sm sm:text-base">Loading meeting recordings...</p>
        </div>
      ) : recordings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {recordings.map((recording) => (
            <MeetingRecordingCard key={recording.id} recording={recording} />
          ))}
        </div>
      ) : (
        <div className="text-light-3 text-center p-4 sm:p-6 md:p-8 bg-dark-3 rounded-xl border border-dark-5">
          <p className="text-sm sm:text-base md:text-lg mb-2">No recordings found.</p>
          <p className="text-xs sm:text-sm">Recordings will appear here after meetings are completed.</p>
        </div>
      )}
    </div>
  );
};

export default MeetingRecordings;
