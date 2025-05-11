import React, { useState, useEffect } from "react";
import { FiBell, FiCheck, FiInfo } from "react-icons/fi";
import { 
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  selectUnreadCount,
  setUnreadCount
} from "@/features/root/notifications";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "@/lib/socket";
import NotificationItem, { NotificationUI } from "@/features/root/notifications/components/NotificationItem";

const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch();
  const unreadCount = useSelector(selectUnreadCount);
  const { socket } = useSocket();
  
  // Local state for notifications
  const [localNotifications, setLocalNotifications] = useState<NotificationUI[]>([]);
  
  // Fetch notifications
  const { data: notificationsData, isLoading, isError, refetch } = useGetNotificationsQuery({});
  
  // Set polling interval (in milliseconds)
  const POLLING_INTERVAL = 30000; // 30 seconds
  
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

  // Polling mechanism to fetch notifications at regular intervals
  useEffect(() => {
    // Initial fetch when component mounts
    refetch();
    
    // Set up polling interval
    const pollingTimer = setInterval(() => {
      refetch();
    }, POLLING_INTERVAL);
    
    // Clean up interval when component unmounts
    return () => {
      clearInterval(pollingTimer);
    };
  }, [refetch]);

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
      
      // Optional: Play a sound or show a toast notification based on type
      if (notification.type === 'role_upgrade_requested') {
        // You could trigger a special alert for admin users here
        console.log('Role upgrade requested notification received');
      }
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
  
  // Group notifications by read status
  const unreadNotifications = notifications.filter(notification => !notification.isRead);
  const readNotifications = notifications.filter(notification => notification.isRead);

  return (
    <div className="flex-1 p-3 sm:p-6 overflow-auto bg-dark-1">
      <div className="max-w-4xl mx-auto">
        {/* Header section with title and mark all button */}
        <div className="bg-dark-2 rounded-t-xl p-4 sm:p-6 shadow-md border border-dark-4 border-b-0 pt-16">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-dark-3 rounded-full">
                <FiBell size={24} className="text-primary-500" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-light-1">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 sm:ml-3 text-xs sm:text-sm bg-primary-600 text-white px-2 sm:px-3 py-1 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h1>
            </div>
            
            {unreadCount > 0 && (
              <button 
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-dark-3 hover:bg-dark-4 transition-colors rounded-lg text-blue-400 text-sm font-medium w-full sm:w-auto"
                onClick={handleMarkAllAsRead}
              >
                <FiCheck className="mr-2" />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Main content section */}
        <div className="bg-dark-2 rounded-b-xl shadow-md border border-dark-4 overflow-hidden mb-6">
          {isLoading && !notifications.length && (
            <div className="flex items-center justify-center p-8 sm:p-12 text-light-3">
              <div className="animate-spin h-6 w-6 sm:h-8 sm:w-8 border-4 border-primary-600 border-t-transparent rounded-full mr-3"></div>
              <p>Loading notifications...</p>
            </div>
          )}

          {isError && !notifications.length && (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-red-400">
              <FiInfo size={32} className="mb-4 sm:size-40" />
              <p className="mb-3 text-center">Error loading notifications. Please try again.</p>
              <button 
                onClick={() => refetch()}
                className="px-4 py-2 bg-dark-4 hover:bg-dark-5 transition-colors rounded-md text-light-2"
              >
                Retry
              </button>
            </div>
          )}

          {notifications.length > 0 ? (
            <div>
              {/* Unread notifications section */}
              {unreadNotifications.length > 0 && (
                <div>
                  <div className="px-4 sm:px-6 py-3 bg-dark-3 text-light-2 text-xs font-semibold uppercase tracking-wider">
                    Unread
                  </div>
                  <div className="divide-y divide-dark-4">
                    {unreadNotifications.map((notification) => (
                      <NotificationItem 
                        key={notification._id} 
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Read notifications section */}
              {readNotifications.length > 0 && (
                <div>
                  <div className="px-4 sm:px-6 py-3 bg-dark-3 text-light-3 text-xs font-semibold uppercase tracking-wider">
                    Earlier
                  </div>
                  <div className="divide-y divide-dark-4">
                    {readNotifications.map((notification) => (
                      <NotificationItem 
                        key={notification._id} 
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (!isLoading && !isError) ? (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-light-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-dark-3 flex items-center justify-center mb-4">
                <FiBell size={24} className="sm:size-32 text-light-4" />
              </div>
              <p className="text-base sm:text-lg mb-2 font-medium">No notifications</p>
              <p className="text-xs sm:text-sm text-light-4">You're all caught up!</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 