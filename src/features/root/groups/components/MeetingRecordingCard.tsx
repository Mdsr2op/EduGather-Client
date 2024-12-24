// src/features/recordings/components/MeetingRecordingCard.tsx
import React from "react";
import { FiDownload } from "react-icons/fi";

interface Recording {
  id: number;
  title: string;
  date: string;
  fileName: string;
  url: string;
}

interface MeetingRecordingCardProps {
  recording: Recording;
}

const MeetingRecordingCard: React.FC<MeetingRecordingCardProps> = ({ recording }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(recording.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", recording.fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Failed to download recording:", error);
      alert("Failed to download the recording.");
    }
  };

  return (
    <div className="bg-dark-3 rounded-lg shadow-lg p-4 flex justify-between items-center hover:bg-dark-4 transition-colors">
      <div>
        <h3 className="text-lg font-semibold text-light-1">{recording.title}</h3>
        <p className="text-sm text-light-3">Recorded on: {recording.date}</p>
      </div>
      <button
        onClick={handleDownload}
        className="flex items-center space-x-1 px-3 py-2 bg-dark-4 text-light-3 rounded hover:bg-dark-3 transition-colors"
      >
        <FiDownload />
        <span className="text-sm">Download</span>
      </button>
    </div>
  );
};

export default MeetingRecordingCard;
