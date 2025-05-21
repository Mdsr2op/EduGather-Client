import { MessageType } from "../../types/messageTypes";
import MessageAvatar from "../MessageAvatar";
import MessageTimestamp from "../MessageTimestamp";

interface DeletedMessageProps {
  message: MessageType;
  isUserMessage: boolean;
  showTimestamp?: boolean;
}

const DeletedMessage = ({ message, isUserMessage, showTimestamp = false }: DeletedMessageProps) => {
  return (
    <div
      id={`message-${message.id}`}
      className={`flex ${isUserMessage ? "justify-end" : "justify-start"} relative my-0.5`}
    >
      <div className={`flex max-w-xs md:max-w-md lg:max-w-lg ${isUserMessage ? "flex-row-reverse" : ""}`}>
        {!isUserMessage && <MessageAvatar senderName={message.senderName} avatar={message.senderAvatar} />}
        <div className="mx-1">
          <div className={`py-2 px-3 rounded-xl ${
            isUserMessage 
              ? "bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 text-light-3 dark:text-light-3 light:text-light-text-3" 
              : "bg-dark-5 dark:bg-dark-5 light:bg-light-bg-5 text-light-3 dark:text-light-3 light:text-light-text-3"
          }`}>
            <div className="italic text-sm">The Message has been removed</div>
          </div>
          
          {showTimestamp && (
            <div className="flex items-center text-xs text-light-3 dark:text-light-3 light:text-light-text-3 mt-1">
              <MessageTimestamp
                timestamp={message.timestamp}
                isUserMessage={isUserMessage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeletedMessage; 