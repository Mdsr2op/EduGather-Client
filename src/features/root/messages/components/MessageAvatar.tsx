const MessageAvatar = ({ senderName, avatar }: { senderName: string, avatar?: string }) => {
  const displayAvatar = avatar && avatar.trim() !== "";
  
  return (
    <div className="flex-shrink-0 flex flex-col items-center">
      {displayAvatar ? (
        <img
          src={avatar}
          alt={`${senderName}'s avatar`}
          className="w-8 h-8 rounded-full object-cover border-2 border-light-3"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-light-3 flex items-center justify-center text-sm font-semibold text-white">
          {senderName.charAt(0)}
        </div>
      )}
      <span className="text-xs text-gray-400 mt-1">{senderName}</span>
    </div>
  );
};

export default MessageAvatar;