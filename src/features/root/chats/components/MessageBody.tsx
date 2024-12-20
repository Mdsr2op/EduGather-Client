// MessageBody.js (updated with auto-scroll)
import React, { useContext, useEffect, useRef } from 'react';
import Message, { MessageType } from '../../messages/components/Message';


interface MessageBodyProps {
    messages: MessageType[];
    userId: string;
}

const MessageBody = ({ messages, userId }: MessageBodyProps) => {
  const endOfMessagesRef = useRef(null);

//   useEffect(() => {
//     endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

  return (
    <div className=" bg-dark-3 p-4 h-full overflow-y-auto custom-scrollbar flex flex-col space-y-4 rounded-lg">
      {messages.map((message) => (
        <div key={message.id} className="space-y-2">
            <Message
              message={message}
              isUserMessage={message.senderId === userId}
            />
        </div>
      ))}
      {/* <div ref={endOfMessagesRef} /> */}
    </div>
  );
};

export default MessageBody;
