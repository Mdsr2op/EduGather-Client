// src/features/meetings/components/ScheduledMeetingCard.tsx
import React from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiUser, FiList, FiUsers, FiVideo } from "react-icons/fi";
import { Meeting } from "@/components/pages/ScheduledMeetings";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useNavigate } from "react-router-dom";

interface ScheduledMeetingCardProps {
  meeting: Meeting;
}

const ScheduledMeetingCard: React.FC<ScheduledMeetingCardProps> = ({ meeting }) => {
  const client = useStreamVideoClient();
  const navigate = useNavigate();
  
  const groupId = meeting.groupId;
  const channelId = meeting.channelId;
  
  const handleJoinMeeting = async () => {
    if (!client) {
      console.error("Stream Video client not initialized");
      return;
    }

    try {
      // Use the meeting's actual ID from Stream
      const callId = meeting.id.toString();
      
      // Create a call using Stream Video client
      const call = client.call("default", callId);
      if (!call) {
        throw new Error("Failed to create meeting");
      }
      
      // Get or create the call
      await call.getOrCreate();
      
      // Navigate to the meeting page
      navigate(`/${groupId}/${channelId}/meeting/${callId}`);
    } catch (error) {
      console.error("Error joining meeting:", error);
      alert("Failed to join meeting. Please try again.");
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <div className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl border border-dark-5 dark:border-dark-5 light:border-light-bg-5 shadow-md hover:shadow-lg overflow-visible p-5 flex flex-col justify-between h-full relative">
        {/* Header with time status */}
        <div className="absolute top-0 right-0 bg-primary-500 text-dark-1 dark:text-dark-1 light:text-light-text-1 text-xs font-medium px-3 py-1 rounded-bl-xl rounded-tr-xl">
          In {meeting.startingIn}
        </div>
        
        {/* Meeting icon floating */}
        <div className="absolute -top-4 left-5 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg z-10">
          <FiVideo className="text-light-1 dark:text-light-1 light:text-white" size={20} />
        </div>
        
        <div className="mt-8">
          <h3 className="text-xl font-bold text-light-1 dark:text-light-1 light:text-light-text-1 mb-4 line-clamp-2">{meeting.title}</h3>
          
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 flex items-center justify-center flex-shrink-0">
                <FiCalendar className="text-primary-400" size={16} />
              </div>
              <div>
                <span className="text-light-3 dark:text-light-3 light:text-light-text-3 block text-xs">Date</span>
                <span className="text-light-1 dark:text-light-1 light:text-light-text-1">{meeting.date}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 flex items-center justify-center flex-shrink-0">
                <FiClock className="text-primary-400" size={16} />
              </div>
              <div>
                <span className="text-light-3 dark:text-light-3 light:text-light-text-3 block text-xs">Time</span>
                <span className="text-light-1 dark:text-light-1 light:text-light-text-1">{meeting.time}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 flex items-center justify-center flex-shrink-0">
                <FiUser className="text-primary-400" size={16} />
              </div>
              <div className="overflow-hidden">
                <span className="text-light-3 dark:text-light-3 light:text-light-text-3 block text-xs">Organizer</span>
                <span className="text-light-1 dark:text-light-1 light:text-light-text-1 truncate block">{meeting.organizer}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 flex items-center justify-center flex-shrink-0">
                <FiUsers className="text-primary-400" size={16} />
              </div>
              <div className="overflow-hidden">
                <span className="text-light-3 dark:text-light-3 light:text-light-text-3 block text-xs">Group</span>
                <span className="text-light-1 dark:text-light-1 light:text-light-text-1 truncate block">{meeting.group}</span>
              </div>
            </div>
          </div>

          {/* Agenda section with collapsible content */}
          <div className="mt-4 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <FiList className="text-primary-400" size={14} />
              <span className="text-light-1 dark:text-light-1 light:text-light-text-1 text-sm font-medium">Agenda</span>
            </div>
            <p className="text-light-3 dark:text-light-3 light:text-light-text-3 text-xs line-clamp-2">{meeting.agenda || "No agenda provided"}</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleJoinMeeting}
          className="mt-5 w-full px-4 py-3 bg-primary-500 hover:bg-primary-600 text-light-1 dark:text-light-1 light:text-white rounded-xl transition-colors flex items-center justify-center"
        >
          <FiVideo className="mr-2" />
          Join Meeting
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ScheduledMeetingCard;
