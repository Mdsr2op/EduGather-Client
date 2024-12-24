// src/components/pages/MeetingRecordings.tsx
import MeetingRecordingCard from "@/features/root/groups/components/MeetingRecordingCard";
import React from "react";

interface Recording {
  id: number;
  title: string;
  date: string;
  fileName: string;
  url: string; // URL to the recording file
}

const DUMMY_RECORDINGS: Recording[] = [
  {
    id: 1,
    title: "Weekly Sync Recording",
    date: "2024-01-10",
    fileName: "weekly-sync.mp4",
    url: "https://example.com/weekly-sync.mp4",
  },
  {
    id: 2,
    title: "Project Kickoff Recording",
    date: "2024-02-05",
    fileName: "project-kickoff.mp4",
    url: "https://example.com/project-kickoff.mp4",
  },
  // Add more dummy recordings as needed
];

const MeetingRecordings: React.FC = () => {
  return (
    <div className="flex-1 p-6 overflow-auto bg-dark-2">
      <h2 className="text-xl font-semibold text-light-1 mb-4">Meeting Recordings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DUMMY_RECORDINGS.map((recording) => (
          <MeetingRecordingCard key={recording.id} recording={recording} />
        ))}
      </div>
    </div>
  );
};

export default MeetingRecordings;
