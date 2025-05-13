const MessageAvatar = ({ senderName }: { senderName: string }) => {
  return (
    <div className="flex-shrink-0 flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-light-3 flex items-center justify-center text-sm font-semibold text-white">
        {senderName.charAt(0)}
      </div>
      <span className="text-xs text-gray-400 mt-1">{senderName}</span>
    </div>
  );
};

export default MessageAvatar;