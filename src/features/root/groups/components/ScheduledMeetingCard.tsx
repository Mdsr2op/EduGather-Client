// src/features/meetings/components/ScheduledMeetingCard.tsx
import React from "react";
import { FiCalendar, FiClock, FiUser, FiHash, FiList, FiUsers } from "react-icons/fi";
import { Meeting } from "@/components/pages/ScheduledMeetings";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useNavigate } from "react-router-dom";

interface ScheduledMeetingCardProps {
  meeting: Meeting;
}

const ScheduledMeetingCard: React.FC<ScheduledMeetingCardProps> = ({ meeting }) => {
  const client = useStreamVideoClient();
  const navigate = useNavigate();

  const handleJoinMeeting = async () => {
    if (!client) {
      console.error("Stream Video client not initialized");
      return;
    }

    try {
      // Use the meeting's actual ID from Stream
      const callId = meeting.id.toString();
      
      try {
        // Check if the call exists
        const response = await client.queryCalls({
          filter_conditions: { id: callId }
        });
        
        const callExists = response.calls && response.calls.length > 0;
        
        if (callExists) {
          // Call exists, get the call
          const call = client.call("default", callId);
          
          // Join the call
          await call.getOrCreate();
          
          // Navigate to the meeting page
          navigate(`/meeting/${callId}`);
        } else {
          throw new Error("Cannot join meeting: Meeting doesn't exist");
        }
      } catch (error) {
        console.error("Failed to join call:", error);
        alert("Error joining meeting. Please try again.");
      }
    } catch (error) {
      console.error("Error processing meeting:", error);
      alert("Failed to process meeting request. Please try again.");
    }
  };

  return (
    <div className="bg-dark-4 rounded-xl shadow-lg p-4 flex flex-col justify-between hover:bg-dark-3 transition-colors text-light-1">
      <div>
        <div className="flex items-center text-lg font-semibold mb-3">
          <FiCalendar className="mr-2" />
          <h3 className="text-xl font-bold">{meeting.title}</h3>
        </div>
        <div className="space-y-2 text-sm text-light-3">
          <div className="flex items-center">
            <FiCalendar className="mr-2 w-4 h-4" />
            <span className="text-light-1">Date:</span>
            <span className="text-light-3 ml-2">{meeting.date}</span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-2 w-4 h-4" />
            <span className="text-light-1">Time:</span>
            <span className="text-light-3 ml-2">{meeting.time}</span>
          </div>
          <div className="flex items-center">
            <FiUser className="mr-2 w-4 h-4" />
            <span className="text-light-1">Organized by:</span>
            <span className="text-light-3 ml-2">{meeting.organizer}</span>
          </div>
          <div className="flex items-center">
            <FiUsers className="mr-2 w-4 h-4" />
            <span className="text-light-1">Group:</span>
            <span className="text-light-3 ml-2">{meeting.group}</span>
          </div>
          <div className="flex items-center">
            <FiHash className="mr-2 w-4 h-4" />
            <span className="text-light-1">Channel:</span>
            <span className="text-light-3 ml-2">{meeting.channel}</span>
          </div>
          <div className="flex items-start">
            <FiList className="mr-2 w-4 h-4 mt-1" />
            <span className="text-light-1">Agenda:</span>
            <span className="text-light-3 ml-2">{meeting.agenda}</span>
          </div>
          <div className="flex items-center">
            <FiClock className="mr-2 w-4 h-4" />
            <span className="text-light-1">Starting in:</span>
            <span className="text-light-3 ml-2">{meeting.startingIn}</span>
          </div>
        </div>
      </div>
      <button
        onClick={handleJoinMeeting}
        className="mt-4 w-full px-4 py-2 bg-primary-500 text-light-1 rounded hover:bg-primary-600 transition-colors"
      >
        Join Meeting
      </button>
    </div>
  );
};

export default ScheduledMeetingCard;
