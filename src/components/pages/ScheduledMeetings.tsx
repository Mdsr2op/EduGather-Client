// src/components/pages/ScheduledMeetings.tsx
import ScheduledMeetingCard from "@/features/root/groups/components/ScheduledMeetingCard";
import React from "react";

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
}

const DUMMY_MEETINGS: Meeting[] = [
  {
    id: 1,
    title: "Weekly Sync",
    date: "2024-01-10",
    time: "10:00 AM",
    description: "Discuss weekly tasks and updates.",
  },
  {
    id: 2,
    title: "Project Kickoff",
    date: "2024-02-05",
    time: "2:00 PM",
    description: "Introduce new project and assign roles.",
  },
  // Add more dummy meetings as needed
];

const ScheduledMeetings: React.FC = () => {
  return (
    <div className="flex-1 p-6 overflow-auto bg-dark-2">
      <h2 className="text-xl font-semibold text-light-1 mb-4">Scheduled Meetings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUMMY_MEETINGS.map((meeting) => (
          <ScheduledMeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </div>
  );
};

export default ScheduledMeetings;
