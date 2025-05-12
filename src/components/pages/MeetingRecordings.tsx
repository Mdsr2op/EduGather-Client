// src/components/pages/MeetingRecordings.tsx
import MeetingRecordingCard from "@/features/root/groups/components/MeetingRecordingCard";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGetCalls } from "@/hooks/useGetCalls";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";
import { CallRecording } from "@stream-io/video-react-sdk";
import { FiVideo, FiFilter, FiSearch, FiGrid, FiList } from "react-icons/fi";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // Get the current user from the Redux store
  const user = useSelector(selectCurrentUser);
  const userId = user?._id;

  // Fetch recordings using useGetCalls hook (with ended status to get calls that might have recordings)
  const { calls, isLoading } = useGetCalls({
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

  // Filter recordings based on search
  const filteredRecordings = recordings.filter(recording => 
    recording.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <FiVideo className="text-primary-500" size={28} />
                Meeting Recordings
              </h1>
              <p className="text-light-3 text-sm sm:text-base max-w-xl">
                Access and manage your recorded meetings for future reference
              </p>
            </div>
            
          </div>
          
          {/* Stats Row */}
          <div className="flex flex-wrap mt-6 gap-4">
            <div className="bg-dark-4/70 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <FiVideo className="text-primary-500" size={16} />
              </div>
              <div>
                <p className="text-xs text-light-3">Total Recordings</p>
                <p className="text-lg font-semibold text-light-1">{recordings.length}</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-dark-3 rounded-xl p-4 mb-6 border border-dark-5 shadow-md"
        >
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-3" size={18} />
              <input
                type="text"
                placeholder="Search recordings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 w-full bg-dark-4 border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl text-sm shadow-inner"
              />
            </div>
            
            {/* Filter & View Toggles */}
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-dark-4 hover:bg-dark-5 text-light-2 rounded-xl flex items-center gap-2">
                <FiFilter size={16} />
                <span className="text-sm">Filter</span>
              </button>
              
              <div className="flex rounded-xl overflow-hidden border border-dark-4">
                <button 
                  className={`px-3 py-2 flex items-center gap-1 ${viewMode === 'grid' ? 'bg-primary-500 text-light-1' : 'bg-dark-4 text-light-3'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid size={16} />
                </button>
                <button 
                  className={`px-3 py-2 flex items-center gap-1 ${viewMode === 'list' ? 'bg-primary-500 text-light-1' : 'bg-dark-4 text-light-3'}`}
                  onClick={() => setViewMode('list')}
                >
                  <FiList size={16} />
                </button>
              </div>
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
              <p className="text-light-3 animate-pulse">Loading meeting recordings...</p>
            </motion.div>
          ) : filteredRecordings.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4 px-1">
                <div className="text-sm text-light-3">
                  <span>Showing <span className="text-light-1 font-medium">{filteredRecordings.length}</span> recordings</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-light-3">
                  <span>Sort by:</span>
                  <select className="bg-dark-3 text-light-2 rounded-xl border border-dark-4 py-1 px-2 text-sm">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="size">Size</option>
                    <option value="duration">Duration</option>
                  </select>
                </div>
              </div>
              
              <div className={viewMode === 'grid' ? 
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : 
                "flex flex-col gap-4"
              }>
                {filteredRecordings.map((recording, index) => (
                  <motion.div
                    key={recording.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={viewMode === 'list' ? "w-full" : ""}
                  >
                    <MeetingRecordingCard recording={recording} />
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
                <FiVideo className="text-light-3" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-light-1 mb-2">No Recordings Found</h3>
              <p className="text-light-3 mb-6 max-w-md">
                {searchQuery ? 
                  "No recordings match your search. Try adjusting your search terms." : 
                  "You don't have any meeting recordings yet. Recordings will appear here after meetings are completed."}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingRecordings;
