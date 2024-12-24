// src/features/meetings/components/ScheduledMeetingCard.tsx
import React from "react";
import { FiCalendar, FiClock, FiVideo } from "react-icons/fi";

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
}

interface ScheduledMeetingCardProps {
  meeting: Meeting;
}

const ScheduledMeetingCard: React.FC<ScheduledMeetingCardProps> = ({ meeting }) => {
  const handleJoinMeeting = () => {
    alert(`Joining meeting: ${meeting.title}`);
    // Implement actual meeting join logic here
  };

  return (
    <div className="bg-dark-3 rounded-lg shadow-lg p-4 flex flex-col justify-between hover:bg-dark-4 transition-colors">
      <div>
        <h3 className="text-lg font-semibold text-light-1 mb-2">{meeting.title}</h3>
        <div className="flex items-center text-sm text-light-3 mb-1">
          <FiCalendar className="mr-1" />
          <span>{meeting.date}</span>
        </div>
        <div className="flex items-center text-sm text-light-3 mb-2">
          <FiClock className="mr-1" />
          <span>{meeting.time}</span>
        </div>
        <p className="text-xs text-light-4">{meeting.description}</p>
      </div>
      <button
        onClick={handleJoinMeeting}
        className="mt-4 px-4 py-2 bg-primary-500 text-light-1 rounded hover:bg-primary-600 flex items-center justify-center"
      >
        <FiVideo className="mr-2" />
        Join Meeting
      </button>
    </div>
  );
};

export default ScheduledMeetingCard;
