import React from "react";


interface ChatHeaderTitleProps {
    channelName: string;
    membersCount: number;
  }

const ChatHeaderTitle: React.FC<ChatHeaderTitleProps> = ({
    channelName,
    membersCount,
  }) => (
  
  <div className=" text-light-2">
    <h1 className="text-xl font-semibold">{channelName}</h1>
    <p className="text-light-3 text-sm">{membersCount} Members</p>
  </div>
);

export default ChatHeaderTitle;
