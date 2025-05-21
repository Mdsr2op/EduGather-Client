import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiCheck, FiInfo, FiCheckCircle, FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi";
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
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
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

  // Get filtered notifications based on filter state
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? unreadNotifications 
      : readNotifications;

  return (
    <div className="p-3 sm:p-6 bg-dark-2 dark:bg-dark-2 light:bg-light-bg-2 text-light-1 dark:text-light-1 light:text-light-text-1 h-full overflow-auto custom-scrollbar transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-r from-dark-4 to-dark-3 dark:from-dark-4 dark:to-dark-3 light:from-light-bg-4 light:to-light-bg-3 rounded-2xl p-6 sm:p-8 mb-6 shadow-lg border border-dark-5 dark:border-dark-5 light:border-light-bg-5"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-dark-4/80 dark:bg-dark-4/80 light:bg-light-bg-4/80 flex items-center justify-center">
                <FiBell className="text-primary-500" size={24} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-light-1 dark:text-light-1 light:text-light-text-1 flex items-center">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-2 text-sm bg-secondary-500 dark:bg-secondary-500 light:bg-light-secondary-500 text-dark-1 px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </h1>
                <p className="text-light-3 dark:text-light-3 light:text-light-text-3 text-sm">Stay updated with your activity and messages</p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleMarkAllAsRead}
                className="flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-light-1 dark:text-light-1 light:text-white px-5 py-2.5 rounded-xl transition-colors shadow-md"
              >
                <FiCheckCircle size={18} />
                <span className="font-medium">Mark All as Read</span>
              </motion.button>
            )}
          </div>
          
          {/* Stats Row */}
          <div className="flex flex-wrap mt-6 gap-4">
            <div className="bg-dark-4/70 dark:bg-dark-4/70 light:bg-light-bg-4/70 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center">
                <FiBell className="text-primary-500" size={16} />
              </div>
              <div>
                <p className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3">Total</p>
                <p className="text-lg font-semibold text-light-1 dark:text-light-1 light:text-light-text-1">{notifications.length}</p>
              </div>
            </div>
            
            <div className="bg-dark-4/70 light:bg-light-bg-5/70 px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-secondary-500/20 dark:bg-secondary-500/20 light:bg-light-secondary-500/20  flex items-center justify-center">
                <FiBell className="text-secondary-500 dark:text-secondary-500 light:text-light-secondary-500" size={16} />
              </div>
              <div>
                <p className="text-xs text-light-3 dark:text-light-3 light:text-light-text-3">Unread</p>
                <p className="text-lg font-semibold text-light-1 dark:text-light-1 light:text-light-text-1">{unreadNotifications.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl p-4 mb-6 border border-dark-5 dark:border-dark-5 light:border-light-bg-5 flex flex-col sm:flex-row justify-between items-start sm:items-center"
        >
          <div className="flex items-center gap-3 mb-3 sm:mb-0">
            <h2 className="font-semibold text-light-1 dark:text-light-1 light:text-light-text-1">Notifications</h2>
            <div className="h-5 w-px bg-dark-5 dark:bg-dark-5 light:bg-light-bg-5"></div>
            <span className="text-sm text-light-3 dark:text-light-3 light:text-light-text-3">
              {filter === 'all' ? 'Showing all' : filter === 'unread' ? 'Showing unread' : 'Showing read'}
            </span>
          </div>
          
          <div className="w-full sm:w-auto">
            <div className="relative">
              <button 
                className="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 hover:bg-dark-5 dark:hover:bg-dark-5 light:hover:bg-light-bg-5 rounded-xl text-light-2 dark:text-light-2 light:text-light-text-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <div className="flex items-center gap-2">
                  <FiFilter size={16} />
                  <span>Filter: {filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                </div>
                {showFilters ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 right-0 left-0 sm:left-auto mt-1 bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 border border-dark-5 dark:border-dark-5 light:border-light-bg-5 rounded-xl shadow-lg overflow-hidden"
                  >
                    <button 
                      className={`w-full text-left px-4 py-2 hover:bg-dark-4 dark:hover:bg-dark-4 light:hover:bg-light-bg-4 flex items-center justify-between ${filter === 'all' ? 'text-primary-500' : 'text-light-2 dark:text-light-2 light:text-light-text-2'}`}
                      onClick={() => { setFilter('all'); setShowFilters(false); }}
                    >
                      <span>All</span>
                      {filter === 'all' && <FiCheck size={16} />}
                    </button>
                    <button 
                      className={`w-full text-left px-4 py-2 hover:bg-dark-4 dark:hover:bg-dark-4 light:hover:bg-light-bg-4 flex items-center justify-between ${filter === 'unread' ? 'text-primary-500' : 'text-light-2 dark:text-light-2 light:text-light-text-2'}`}
                      onClick={() => { setFilter('unread'); setShowFilters(false); }}
                    >
                      <span>Unread</span>
                      {filter === 'unread' && <FiCheck size={16} />}
                    </button>
                    <button 
                      className={`w-full text-left px-4 py-2 hover:bg-dark-4 dark:hover:bg-dark-4 light:hover:bg-light-bg-4 flex items-center justify-between ${filter === 'read' ? 'text-primary-500' : 'text-light-2 dark:text-light-2 light:text-light-text-2'}`}
                      onClick={() => { setFilter('read'); setShowFilters(false); }}
                    >
                      <span>Read</span>
                      {filter === 'read' && <FiCheck size={16} />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Notifications Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-dark-3 dark:bg-dark-3 light:bg-light-bg-3 rounded-xl overflow-hidden border border-dark-5 dark:border-dark-5 light:border-light-bg-5 shadow-md"
        >
          {isLoading && !notifications.length ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
              <p className="text-light-3 dark:text-light-3 light:text-light-text-3 animate-pulse">Loading notifications...</p>
            </div>
          ) : isError && !notifications.length ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-16 h-16 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-full flex items-center justify-center mb-4 text-red-400">
                <FiInfo size={32} />
              </div>
              <h3 className="text-lg font-semibold text-light-1 dark:text-light-1 light:text-light-text-1 mb-2">Error Loading Notifications</h3>
              <p className="text-light-3 dark:text-light-3 light:text-light-text-3 mb-6 text-center max-w-md px-4">
                We encountered a problem loading your notifications. Please try again.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => refetch()}
                className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-light-1 dark:text-light-1 light:text-white rounded-xl flex items-center gap-2"
              >
                <span>Retry</span>
              </motion.button>
            </motion.div>
          ) : filteredNotifications.length > 0 ? (
            <div className="divide-y divide-dark-4 dark:divide-dark-4 light:divide-light-bg-4">
              {filteredNotifications.map((notification, index) => (
                <motion.div 
                  key={notification._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <NotificationItem 
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <div className="w-16 h-16 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 rounded-full flex items-center justify-center mb-4">
                <FiBell className="text-light-3 dark:text-light-3 light:text-light-text-3" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-light-1 dark:text-light-1 light:text-light-text-1 mb-2">All Caught Up!</h3>
              <p className="text-light-3 dark:text-light-3 light:text-light-text-3 mb-2 text-center max-w-md px-4">
                {filter === 'all' 
                  ? "You don't have any notifications at the moment." 
                  : filter === 'unread' 
                    ? "You don't have any unread notifications." 
                    : "You don't have any read notifications."}
              </p>
              {filter !== 'all' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilter('all')}
                  className="mt-4 px-4 py-2 bg-dark-4 dark:bg-dark-4 light:bg-light-bg-4 hover:bg-dark-5 dark:hover:bg-dark-5 light:hover:bg-light-bg-5 text-light-2 dark:text-light-2 light:text-light-text-2 rounded-xl"
                >
                  View All Notifications
                </motion.button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NotificationsPage; 