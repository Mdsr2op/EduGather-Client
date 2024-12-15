

import MessageAvatar from "./MessageAvatar";
import MessageTimestamp from "./MessageTimestamp";

export interface MessageType{
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: number;
}

export interface MessageProps {
  message: MessageType
  isUserMessage: boolean
}

const Message = ({message, isUserMessage}: MessageProps) => {

  return (
    <div
      className={`flex ${isUserMessage ? "justify-end" : "justify-start"} relative my-2`}
    >
      <div className={`flex max-w-xs ${isUserMessage ? "flex-row-reverse" : ""}`}>
        <MessageAvatar senderName={message.senderName} />
        <div className="mx-2">
          <div
            className={`p-3 rounded-lg cursor-pointer transition-transform transform hover:scale-105 ${
              isUserMessage ? "bg-primary text-light1" : "bg-dark5 text-light1"
            }`}
          >
              <p className="text-sm">{message.text}</p>
          </div>
          <div className="flex items-center text-xs text-gray-400 mt-1">
            <MessageTimestamp
              timestamp={message.timestamp}
              isUserMessage={isUserMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
