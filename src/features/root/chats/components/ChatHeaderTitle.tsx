import React from "react";


interface ChatHeaderTitleProps {
    channelName: string;
    membersCount: number;
  }

const ChatHeaderTitle: React.FC<ChatHeaderTitleProps> = ({
    channelName,
    membersCount,
  }) => (
  
  <div className="ml-4 text-light2">
    <h1 className="text-xl font-semibold">{channelName}</h1>
    <p className="text-light3 text-sm">{membersCount} Members</p>
  </div>
);

export default ChatHeaderTitle;
