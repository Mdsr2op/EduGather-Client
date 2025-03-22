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
      <div className="bg-dark-3 flex justify-between items-center border-b-[1px] border-dark-3 relative">
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
