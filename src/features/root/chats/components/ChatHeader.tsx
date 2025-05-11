import ChatHeaderActions from "./ChatHeaderActions";
import ChatHeaderTitle from "./ChatHeaderTitle";
import { FiArrowLeft } from "react-icons/fi";

interface ChatHeaderProps {
  channelName: string;
  membersCount: number;
  onToggleSidebar: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  channelName,
  membersCount,
  onToggleSidebar,
}) => {
  return (
    <div className="sticky top-0 z-10">
      <div className="bg-dark-3 flex justify-between items-center border-b-[1px] border-dark-4 shadow-sm px-4 py-8 sm:px-6 sm:py-4 transition-all duration-200 relative">
        <div className="flex items-center gap-2">
          {/* Back button for mobile */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-dark-4 transition-colors"
            aria-label="Go back to channels"
          >
            <FiArrowLeft size={20} className="text-light-1" />
          </button>
          <ChatHeaderTitle
            channelName={channelName}
            membersCount={membersCount}
          />
        </div>
        <ChatHeaderActions />
      </div>
      {/* Add subtle gradient shadow effect */}
      <div className="h-2 bg-gradient-to-b from-dark-4/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default ChatHeader;
