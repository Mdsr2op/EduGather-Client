import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import Message, { MessageType } from '../../messages/components/Message';

interface MessageBodyProps {
  messages: MessageType[];
  userId: string;
}

const MessageBody = ({ messages, userId }: MessageBodyProps) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [prevMessageCount, setPrevMessageCount] = useState(0);

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    const oldScrollHeight = container.scrollHeight;
    const oldScrollTop = container.scrollTop;

    if (messages.length > prevMessageCount) {
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
      });
    }

    setPrevMessageCount(messages.length);
  }, [messages]);

  const shouldShowTimestamp = (message: MessageType, index: number) => {
    if (index === messages.length - 1) return true;
    if (messages[index + 1].senderId !== message.senderId) return true;
    if (messages[index + 1].timestamp - message.timestamp > 300000) return true;
    return false;
  };

  return (
    <div
      ref={messagesContainerRef}
      className="bg-dark-3 p-4 h-full overflow-y-auto custom-scrollbar flex flex-col space-y-0 rounded-lg"
    >
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
