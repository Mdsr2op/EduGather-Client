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
      <div className="bg-dark-3 pt-3 pb-1 flex justify-between border-b-[2px] border-light-4 shadow-dark-1 shadow-2xl  relative">
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
