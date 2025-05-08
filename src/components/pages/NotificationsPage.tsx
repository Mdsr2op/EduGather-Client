import React, { useState, useEffect } from "react";
import { FiBell, FiMessageSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { 
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  selectUnreadCount,
  setUnreadCount
} from "@/features/notifications";
import { useGetGroupDetailsQuery } from "@/features/root/groups/slices/groupApiSlice";
import { useGetChannelDetailsQuery } from "@/features/root/channels/slices/channelApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { useSocket } from "@/lib/socket";

interface NotificationUI {
  _id: string;
  type: 'channel_message';
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
}

const NotificationItem: React.FC<{ notification: NotificationUI; onMarkAsRead: (id: string) => void }> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const navigate = useNavigate();

  // Fetch group details
  const { data: groupDetails } = useGetGroupDetailsQuery(notification.groupId, {
    skip: !notification.groupId,
  });

  // Fetch channel details
  const { data: channelDetails } = useGetChannelDetailsQuery({
    groupId: notification.groupId,
    channelId: notification.channelId
  }, {
    skip: !notification.groupId || !notification.channelId,
  });

  const groupName = groupDetails?.name || 'Loading...';
  const channelName = channelDetails?.data?.channelName || 'Loading...';

  const handleClick = () => {
    // Mark as read if not already read
    if (!notification.isRead) {
      onMarkAsRead(notification._id);
    }
    
    // Navigate to the specific channel where the message was posted
    navigate(`/${notification.groupId}/${notification.channelId}`);
  };

  const formattedTime = notification.createdAt 
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : '';

  return (
    <div 
      className={`p-4 border-b border-dark-4 ${notification.isRead ? 'bg-dark-2' : 'bg-dark-3'} hover:bg-dark-4 transition-colors cursor-pointer`}
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div className="mr-4 mt-1 p-2 bg-dark-5 rounded-full">
          <FiMessageSquare className="text-blue-400" />
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${notification.isRead ? 'text-light-2' : 'text-light-1'}`}>
            {notification.title}
          </h3>
          <p className="text-light-3 text-sm mt-1">{notification.message}</p>
          <div className="flex justify-between mt-2">
            <span className="text-light-4 text-xs">
              {groupName} • {channelName}
            </span>
            <span className="text-light-4 text-xs">{formattedTime}</span>
          </div>
        </div>
        {!notification.isRead && (
          <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const unreadCount = useSelector(selectUnreadCount);
  const { socket } = useSocket();
  
  // Local state for notifications
  const [localNotifications, setLocalNotifications] = useState<NotificationUI[]>([]);
  
  // Fetch notifications
  const { data: notificationsData, isLoading, isError, refetch } = useGetNotificationsQuery({});
  
  // Update local state when notifications data changes
  useEffect(() => {
    if (notificationsData?.data?.notifications) {
      setLocalNotifications(notificationsData.data.notifications);
      
      // Calculate and update unread count in Redux store
      const unreadNotifications = notificationsData.data.notifications.filter(
        (notification: NotificationUI) => !notification.isRead
      ).length;
      
      dispatch(setUnreadCount(unreadNotifications));
    }
  }, [notificationsData, dispatch]);

  // Setup socket listener for new notifications
  useEffect(() => {
    if (!socket) return;
    
    // Listen for new notifications
    const handleNewNotification = (notification: NotificationUI) => {
      setLocalNotifications(prevNotifications => {
        // Add the new notification to the beginning of the array
        const updatedNotifications = [notification, ...prevNotifications];
        
        // Update unread count in Redux store
        const newUnreadCount = updatedNotifications.filter(
          notification => !notification.isRead
        ).length;
        
        dispatch(setUnreadCount(newUnreadCount));
        
        return updatedNotifications;
      });
    };
    
    // Subscribe to notification_created event
    socket.on("notification_created", handleNewNotification);
    
    // Cleanup function to unsubscribe
    return () => {
      socket.off("notification_created", handleNewNotification);
    };
  }, [socket, dispatch]);
  
  // Mutations for marking notifications as read
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  // Handler for marking a specific notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId).unwrap();
      // Update local state immediately for better UX
      setLocalNotifications(prevNotifications => {
        const updatedNotifications = prevNotifications.map(notification => 
          notification._id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        );
        
        // Update unread count in Redux store
        const newUnreadCount = updatedNotifications.filter(notification => !notification.isRead).length;
        dispatch(setUnreadCount(newUnreadCount));
        
        return updatedNotifications;
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  // Handler for marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      // Update local state immediately
      setLocalNotifications(prevNotifications => {
        const updatedNotifications = prevNotifications.map(notification => ({ ...notification, isRead: true }));
        
        // Update unread count in Redux store
        dispatch(setUnreadCount(0));
        
        return updatedNotifications;
      });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };
  
  // Use local state for rendering
  const notifications = localNotifications;

  return (
    <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto bg-dark-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-light-1">
          Message Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button 
            className="text-blue-400 hover:text-blue-300 text-sm"
            onClick={handleMarkAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {isLoading && !notifications.length && (
        <div className="text-light-3 text-center p-8 bg-dark-3 rounded-xl border border-dark-5">
          <p>Loading notifications...</p>
        </div>
      )}

      {isError && !notifications.length && (
        <div className="text-red-400 text-center p-8 bg-dark-3 rounded-xl border border-dark-5">
          <p>Error loading notifications. Please try again.</p>
          <button 
            onClick={() => refetch()}
            className="mt-2 px-4 py-2 bg-dark-4 hover:bg-dark-5 rounded-md"
          >
            Retry
          </button>
        </div>
      )}

      {notifications.length > 0 ? (
        <div className="bg-dark-1 rounded-xl overflow-hidden shadow-lg">
          {notifications.map((notification) => (
            <NotificationItem 
              key={notification._id} 
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      ) : (!isLoading && !isError) ? (
        <div className="text-light-3 text-center p-8 bg-dark-3 rounded-xl border border-dark-5">
          <div className="flex justify-center mb-4">
            <FiBell size={32} className="text-light-4" />
          </div>
          <p className="text-lg mb-2">No new messages</p>
          <p className="text-sm">You're all caught up!</p>
        </div>
      ) : null}
    </div>
  );
};

export default NotificationsPage; 