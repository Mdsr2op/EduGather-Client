import ChatHeaderActions from "./ChatHeaderActions";
import ChatHeaderTitle from "./ChatHeaderTitle";

interface ChatHeaderProps {
  channelName: string;
  membersCount: number;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  channelName,
  membersCount,
}) => {
  return (
    <div className="sticky top-0 z-10">
      <div className="bg-dark-3 flex justify-between items-center border-b-[1px] border-dark-4 shadow-sm px-4 py-3 sm:px-6 sm:py-4 transition-all duration-200 relative">
        <ChatHeaderTitle
          channelName={channelName}
          membersCount={membersCount}
        />
        <ChatHeaderActions />
      </div>
      {/* Add subtle gradient shadow effect */}
      <div className="h-2 bg-gradient-to-b from-dark-4/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default ChatHeader;
