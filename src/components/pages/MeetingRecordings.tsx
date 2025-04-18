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
    <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto bg-dark-2">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-light-1 mb-2 sm:mb-3 md:mb-4">Meeting Recordings</h2>
      {DUMMY_RECORDINGS.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {DUMMY_RECORDINGS.map((recording) => (
            <MeetingRecordingCard key={recording.id} recording={recording} />
          ))}
        </div>
      ) : (
        <div className="text-light-3 text-center p-4 sm:p-6 md:p-8 bg-dark-3 rounded-xl border border-dark-5">
          <p className="text-sm sm:text-base md:text-lg mb-2">No recording found.</p>
          <p className="text-xs sm:text-sm">Recordings will appear here after meetings are completed.</p>
        </div>
      )}
    </div>
  );
};

export default MeetingRecordings;
