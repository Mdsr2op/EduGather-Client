// Export components
export { default as NotificationBadge } from './components/NotificationBadge';

// Export types
export * from './types';

// Export redux slice
export {
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount,
  setLastNotification,
  toggleNotificationDrawer,
  setNotificationDrawer,
  selectUnreadCount,
  selectLastNotification,
  selectShowNotificationDrawer,
} from './slices/notificationSlice';

// Export API slice
export {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from './slices/notificationApiSlice'; 