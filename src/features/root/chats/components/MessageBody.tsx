import { useRef, useState, useLayoutEffect } from 'react';
import { MessageType } from '../../messages/types/messageTypes';
import Message from '../../messages/components/Message';

interface MessageBodyProps {
  messages: MessageType[];
  userId: string;
  initialLoad?: boolean;
}

const MessageBody = ({ messages, userId, initialLoad = false }: MessageBodyProps) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [prevMessageCount, setPrevMessageCount] = useState(0);

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    // Skip scroll adjustment for initial load, we'll handle it in the parent
    if (initialLoad) {
      setPrevMessageCount(messages.length);
      return;
    }
    
    const oldScrollHeight = container.scrollHeight;
    const oldScrollTop = container.scrollTop;

    if (messages.length > prevMessageCount) {
      requestAnimationFrame(() => {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = oldScrollTop + (newScrollHeight - oldScrollHeight);
      });
    }

    setPrevMessageCount(messages.length);
  }, [messages, initialLoad]);

  const shouldShowTimestamp = (message: MessageType, index: number) => {
    if (index === messages.length - 1) return true;
    if (messages[index + 1].senderId !== message.senderId) return true;
    if (messages[index + 1].timestamp - message.timestamp > 300000) return true;
    return false;
  };

  return (
    <div
      ref={messagesContainerRef}
      className="bg-dark-3 p-2 sm:p-4 h-full overflow-x-hidden overflow-y-auto custom-scrollbar flex flex-col space-y-0 rounded-lg"
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-light-3 text-sm sm:text-base">
          No messages yet. Start the conversation!
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <div key={`message-${message.id}-${index}`} id={`message-${message.id}`}>
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
