import AddChannelButton from "../../chats/components/dialogs/AddChannelButton";
import ChannelList from "./ChannelList";

interface Channel {
  id: string;
  name: string;
}

interface ChannelSidebarProps {
  channels: Channel[];
  selectedChannel: string;
  onSelectChannel: (channelName: string) => void;
}

const ChannelSidebar: React.FC<ChannelSidebarProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
}) => {
  return (
    <div className="bg-dark-4 text-light-2 w-64 h-full p-4 flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-[1.53rem] border-b-[1px] border-dark-3 -mx-4">
        <h2 className="ml-4 text-xl font-semibold text-light-1">Channels</h2>
      </div>

      {/* Channel List */}
      <ChannelList
        channels={channels}
        selectedChannel={selectedChannel}
        onSelectChannel={onSelectChannel}
      />

      <AddChannelButton />
    </div>
  );
};

export default ChannelSidebar;
