import React from "react";

// Helper function to format the timestamp
const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

interface MessageTimestampProps {
  timestamp: number; // Assuming the timestamp is in milliseconds since epoch
  isUserMessage: boolean;
}

const MessageTimestamp: React.FC<MessageTimestampProps> = ({ timestamp, isUserMessage }) => (
  <span className={`text-xs ${isUserMessage ? "text-right" : "text-left"} text-gray-500`}>
    {formatTimestamp(timestamp)}
  </span>
);

export default MessageTimestamp;
