// ChannelList.tsx
import React from "react";
import Channel from "./Channel";

type Channels = {
  id: string;
  name: string;
};

interface ChannelListProps {
  channels: Channels[];
  selectedChannelId: string | null;
  onChannelClick: (channelId: string) => void;
  onChannelContextMenu: (channelId: string, e: React.MouseEvent<HTMLLIElement>) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  selectedChannelId,
  onChannelClick,
  onChannelContextMenu,
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {channels.length === 0 ? (
        <div className="text-center py-4 px-2 text-light-3 bg-dark-3 rounded-md">
          <p>No channels available.</p>
          <p className="text-xs mt-1">Click the + button to create a channel.</p>
        </div>
      ) : (
        <ul className="flex flex-col space-y-1">
          {channels.map((channel) => (
            <Channel
              key={channel.id}
              id={channel.id}
              name={channel.name}
              isSelected={channel.id === selectedChannelId}
              onClick={() => onChannelClick(channel.id)}
              onContextMenu={(e) => onChannelContextMenu(channel.id, e)}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChannelList;
