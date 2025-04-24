import React from "react";
import { FiHash, FiUsers } from "react-icons/fi";

interface ChatHeaderTitleProps {
  channelName: string;
  membersCount: number;
}

const ChatHeaderTitle: React.FC<ChatHeaderTitleProps> = ({
  channelName,
  membersCount,
}) => (
  <div className="flex items-center">
    <div className="bg-dark-4 rounded-xl p-2 mr-3 hidden sm:flex">
      <FiHash className="text-primary-500 w-5 h-5" />
    </div>
    <div className="text-light-1">
      <div className="flex items-center">
        <FiHash className="text-primary-500 w-4 h-4 mr-1 sm:hidden" />
        <h1 className="text-xl font-bold">{channelName}</h1>
      </div>
      <div className="flex items-center text-light-3 text-sm mt-1">
        <FiUsers className="w-3 h-3 mr-1" />
        <p>{membersCount} {membersCount === 1 ? "Member" : "Members"}</p>
      </div>
    </div>
  </div>
);

export default ChatHeaderTitle;
