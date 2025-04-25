const MessageAvatar = ({ senderName }: { senderName: string }) => {
  return (
    <div className="flex-shrink-0">
      <div className="w-8 h-8 rounded-full bg-light-3 flex items-center justify-center text-sm font-semibold text-white">
        {senderName.charAt(0)}
      </div>
    </div>
  );
};

export default MessageAvatar;