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
    <>
      <div className="bg-dark-4 pb-1 flex justify-between items-center border-b-[1px] border-dark3 -mx-4 relative">
        <ChatHeaderTitle
          channelName={channelName}
          membersCount={membersCount}
        />
        <ChatHeaderActions />
      </div>
    </>
  );
};

export default ChatHeader;
