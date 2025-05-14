import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMessageSquare, FiVideo, FiClock, FiUserPlus, FiCheck, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useGetGroupDetailsQuery } from "@/features/root/groups/slices/groupApiSlice";
import { useGetChannelDetailsQuery } from "@/features/root/channels/slices/channelApiSlice";
import { formatDistanceToNow } from "date-fns";
import { useDispatch } from "react-redux";
import { setSelectedChannelId } from "@/features/root/channels/slices/channelSlice";

export interface NotificationUI {
  _id: string;
  type: 'channel_message' | 'meeting_created' | 'role_upgrade_requested' | string;
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
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

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

  const groupName = groupDetails?.name || notification.groupName || 'Unknown Group';
  const channelName = channelDetails?.data?.channelName || notification.channelName || 'General';

  const handleClick = () => {
    // Mark as read if not already read
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
    
    // Handle navigation based on notification type
    switch (notification.type) {
      case 'channel_message':
        // Set the selected channel ID in Redux before navigation
        dispatch(setSelectedChannelId(notification.channelId));
        navigate(`/${notification.groupId}/${notification.channelId}`);
        break;
      case 'meeting_created':
        // Set the selected channel ID in Redux before navigation
        dispatch(setSelectedChannelId(notification.channelId));
        navigate(`/${notification.groupId}/${notification.channelId}`);
        break;
      case 'role_upgrade_requested':
        navigate(`/settings/users`); // Navigate to user management page
        break;
      default:
        console.warn(`Unhandled notification type: ${notification.type}`);
        break;
    }
  };

  const markReadWithoutNavigation = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
  };

  const formattedTime = notification.createdAt 
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : '';

  const renderIcon = () => {
    switch (notification.type) {
      case 'channel_message':
        return <FiMessageSquare size={20} />;
      case 'meeting_created':
        return <FiVideo size={20} />;
      case 'role_upgrade_requested':
        return <FiUserPlus size={20} />;
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
      case 'role_upgrade_requested':
        return 'Role Request';
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
      case 'role_upgrade_requested':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{ 
        backgroundColor: isHovered 
          ? 'var(--color-dark-4)' 
          : notification.isRead 
            ? 'var(--color-dark-3)' 
            : 'var(--color-dark-3)' 
      }}
      whileHover={{ backgroundColor: 'var(--color-dark-4)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleClick}
      className={`relative p-4 sm:p-5 cursor-pointer overflow-hidden group ${notification.isRead ? '' : 'border-l-2 border-l-secondary-500'}`}
    >
      {notification.isRead ? null : (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary-500"></div>
      )}
      
      <div className="flex items-start gap-3">
        {/* Left side icon */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${getTypeColor()} shadow-lg flex items-center justify-center text-light-1`}>
          {renderIcon()}
        </div>
        
        {/* Content area */}
        <div className="flex-1 min-w-0">
          {/* Header with title and timestamp */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 mb-2">
            <h3 className={`font-semibold ${notification.isRead ? 'text-light-2' : 'text-light-1'} truncate`}>
              {notification.title}
            </h3>
            <div className="flex items-center text-xs text-light-4 whitespace-nowrap">
              <FiClock className="mr-1" size={12} />
              {formattedTime}
            </div>
          </div>
          
          {/* Message content */}
          <p className="text-light-3 text-sm mb-3 line-clamp-2">
            {notification.type === 'meeting_created' ? notification.content : notification.message}
          </p>
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {/* Type tag */}
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full text-light-1 ${getTypeColor()}`}>
              {getTypeLabel()}
            </span>
            
            {/* Group and channel tags for relevant notifications */}
            {['channel_message', 'meeting_created'].includes(notification.type) && (
              <>
                {groupName && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-dark-5 text-light-2 overflow-hidden text-ellipsis max-w-[140px] whitespace-nowrap">
                    {groupName}
                  </span>
                )}
                
                {channelName && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-dark-5 text-light-2 overflow-hidden text-ellipsis max-w-[140px] whitespace-nowrap">
                    # {channelName}
                  </span>
                )}
              </>
            )}
            
            {/* Sender tag for role requests */}
            {notification.type === 'role_upgrade_requested' && notification.senderName && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-dark-5 text-light-2">
                {notification.senderName}
              </span>
            )}
          </div>
        </div>
        
        {/* Right side actions */}
        <div className="flex flex-col items-end justify-between h-full mt-1">
          {!notification.isRead ? (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={markReadWithoutNavigation}
              className="p-1.5 bg-dark-5 hover:bg-dark-4 rounded-full text-light-3 hover:text-light-1 transition-colors"
              aria-label="Mark as read"
            >
              <FiCheck size={14} />
            </motion.button>
          ) : (
            <div className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <FiChevronRight size={16} className="text-light-3" />
            </div>
          )}
        </div>
      </div>
      
      {/* Hover state indicator */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default NotificationItem; 