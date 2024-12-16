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
    <div className="bg-dark-3 text-light-2 w-64 h-full p-4 pt-0 flex flex-col relative border-r-[2px] border-dark-1 shadow-dark-1 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pt-4 pb-[1.3rem] border-r-[2px] border-b-[2px] border-dark-1 border-b-light-4 shadow-dark-1 shadow-2xl -mx-4">
        <h2 className="ml-4 text-xl font-semibold text-light1">Channels</h2>
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
