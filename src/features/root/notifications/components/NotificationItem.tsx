import React from "react";
import { FiMessageSquare, FiVideo, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useGetGroupDetailsQuery } from "@/features/root/groups/slices/groupApiSlice";
import { useGetChannelDetailsQuery } from "@/features/root/channels/slices/channelApiSlice";
import { formatDistanceToNow } from "date-fns";

export interface NotificationUI {
  _id: string;
  type: 'channel_message' | 'meeting_created' | string;
  title: string;
  message: string;
  isRead: boolean;
  groupId: string;
  channelId: string;
  senderId?: string;
  recipient: string;
  createdAt: string;
  updatedAt: string;
  groupName?: string;
  channelName?: string;
  senderName?: string;
  content?: string; // For meeting_created notifications
}

interface NotificationItemProps {
  notification: NotificationUI;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const navigate = useNavigate();

  // Only fetch group and channel details for relevant types
  const { data: groupDetails } = useGetGroupDetailsQuery(notification.groupId, {
    skip: !notification.groupId || !['channel_message', 'meeting_created'].includes(notification.type),
  });

  // Fetch channel details
  const { data: channelDetails } = useGetChannelDetailsQuery({
    groupId: notification.groupId,
    channelId: notification.channelId
  }, {
    skip: !notification.groupId || !notification.channelId || !['channel_message', 'meeting_created'].includes(notification.type),
  });

  const groupName = groupDetails?.name || 'Loading...';
  const channelName = channelDetails?.data?.channelName || 'Loading...';

  const handleClick = () => {
    // Mark as read if not already read
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
    
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'channel_message':
        navigate(`/${notification.groupId}/${notification.channelId}`);
        break;
      case 'meeting_created':
        navigate(`/${notification.groupId}/${notification.channelId}`);
        break;
      default:
        console.warn(`Unhandled notification type: ${notification.type}`);
        break;
    }
  };

  const formattedTime = notification.createdAt 
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : '';

  const renderIcon = () => {
    switch (notification.type) {
      case 'channel_message':
        return <FiMessageSquare className="w-5 h-5" />;
      case 'meeting_created':
        return <FiVideo className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getTypeLabel = () => {
    switch (notification.type) {
      case 'channel_message':
        return 'Message';
      case 'meeting_created':
        return 'Meeting';
      default:
        return 'Notification';
    }
  };

  const getTypeColor = () => {
    switch (notification.type) {
      case 'channel_message':
        return 'bg-blue-600';
      case 'meeting_created':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div 
      className={`relative p-3 sm:p-5 ${notification.isRead ? 'bg-dark-2' : 'bg-dark-3'} hover:bg-dark-4 transition-all duration-200 cursor-pointer border-b border-dark-4`}
      onClick={handleClick}
    >
      <div className="flex items-start">
        {/* Left side with icon */}
        <div className={`shrink-0 p-2 sm:p-3 rounded-full ${notification.isRead ? 'bg-dark-4' : getTypeColor()} text-white shadow-md mr-3 sm:mr-4`}>
          {renderIcon()}
        </div>
        
        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Header with title and timestamp */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 mb-2">
            <h3 className={`font-bold text-sm sm:text-base truncate ${notification.isRead ? 'text-light-2' : 'text-light-1'}`}>
              {notification.title}
            </h3>
            <div className="flex items-center text-xs text-light-4 whitespace-nowrap">
              <FiClock className="mr-1" size={12} />
              {formattedTime}
            </div>
          </div>
          
          {/* Message content */}
          <p className="text-light-3 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
            {notification.type === 'meeting_created' ? notification.content : notification.message}
          </p>
          
          {/* Footer with tags */}
          {['channel_message', 'meeting_created'].includes(notification.type) && (
            <div className="flex items-center flex-wrap gap-1 sm:gap-2 mt-1">
              {/* Type tag */}
              <span className={`px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full text-white ${getTypeColor()}`}>
                {getTypeLabel()}
              </span>
              
              {/* Group tag */}
              <span className="px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full bg-dark-5 text-light-2">
                {groupName}
              </span>
              
              {/* Channel tag */}
              <span className="px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full bg-dark-5 text-light-2">
                # {channelName}
              </span>
            </div>
          )}
        </div>
        
        {/* Unread indicator */}
        {!notification.isRead && (
          <div className="absolute top-3 sm:top-5 right-3 sm:right-5 h-2 w-2 sm:h-3 sm:w-3 bg-primary-600 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem; 