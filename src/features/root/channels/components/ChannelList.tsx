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
  const arrowStyle = {
    animation: 'bounceDown 1s infinite',
  };

  return (
    <div className={`flex-1 overflow-y-auto ${channels.length === 0 ? 'flex items-center' : ''}`}>
      {channels.length === 0 ? (
        <div className="text-center py-8 px-4 text-light-3 bg-dark-4 rounded-md w-full my-auto">
          <p className="text-lg mb-4">No channels available.</p>
          <div className="my-6 text-primary-500">
            <p className="text-md mb-4">Click the + button below to create a channel</p>
            <div style={arrowStyle} className="arrow-container">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
          <style>
            {`
              @keyframes bounceDown {
                0%, 100% {
                  transform: translateY(0);
                }
                50% {
                  transform: translateY(10px);
                }
              }
            `}
          </style>
        </div>
      ) : (
        <ul className="flex flex-col space-y-3 w-full px-2 py-3">
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
