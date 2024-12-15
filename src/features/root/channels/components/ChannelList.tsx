// ChannelList.js
import React from 'react';
import Channel from './Channel';

interface Channel {
    id: string;
    name: string;
  }
  
  interface ChannelListProps {
    channels: Channel[];
    selectedChannel: string;
    onSelectChannel: (channelName: string) => void;
  }
const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
}) => {
  if (channels.length === 0) {
    return (
      <li className="text-ligh-t3 italic text-center mt-4">
        No channels available
      </li>
    );
  }

  return (
    <ul className="flex-grow overflow-y-auto">
      {channels.map((channel) => (
        <Channel
          key={channel.id || channel.name}
          name={channel.name}
          isSelected={selectedChannel === channel.name}
          onSelect={() => onSelectChannel(channel.name)}
        />
      ))}
    </ul>
  );
};

export default ChannelList;
