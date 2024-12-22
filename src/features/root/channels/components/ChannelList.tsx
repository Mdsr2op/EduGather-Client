// ChannelList.tsx
import React from "react";
import Channel from "./Channel";

type Channels = {
  id: string,
  name: string
}
interface ChannelListProps {
  channels: Channels[];
  selectedChannelId: string | null;
}

const ChannelList: React.FC<ChannelListProps> = ({ channels, selectedChannelId }) => {
  return (
    <ul className="flex flex-col space-y-1 overflow-y-auto">
      {channels.map((channel) => (
        <Channel
          key={channel.id}
          id={channel.id}
          name={channel.name}
          isSelected={channel.id === selectedChannelId}
        />
      ))}
    </ul>
  );
};

export default ChannelList;
