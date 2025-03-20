// MessageBody.js (updated with auto-scroll)
import React, { useEffect, useRef, useState } from 'react';
import Message, { MessageType } from '../../messages/components/Message';

interface MessageBodyProps {
  messages: MessageType[];
  userId: string;
}

const MessageBody = ({ messages, userId }: MessageBodyProps) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [prevMessageCount, setPrevMessageCount] = useState(0);

  // Auto-scroll to bottom only when new messages are added
  useEffect(() => {
    // Only scroll if the number of messages has increased (new messages added)
    if (messages.length > prevMessageCount) {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update the previous message count
    setPrevMessageCount(messages.length);
  }, [messages, prevMessageCount]);

  // Function to determine if timestamp should be shown for a message
  const shouldShowTimestamp = (message: MessageType, index: number) => {
    // Always show timestamp for the last message
    if (index === messages.length - 1) return true;
    
    // Show timestamp if sender changes between current and next message
    if (messages[index + 1].senderId !== message.senderId) return true;
    
    // Show timestamp if there's a time gap of more than 5 minutes (300000 ms)
    if (messages[index + 1].timestamp - message.timestamp > 300000) return true;
    
    return false;
  };

  return (
    <div className="bg-dark-3 p-4 h-full overflow-y-auto custom-scrollbar flex flex-col space-y-0 rounded-lg">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-light-3">
          No messages yet. Start the conversation!
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div key={message.id}>
              <Message
                message={message}
                isUserMessage={message.senderId === userId}
                showTimestamp={shouldShowTimestamp(message, index)}
              />
            </div>
          ))}
          <div ref={endOfMessagesRef} />
        </>
      )}
    </div>
  );
};

export default MessageBody;
