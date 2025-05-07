// Re-export types
export * from './types';

// Re-export API slice hooks
export {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from './slices/notificationApiSlice';

// Re-export notification slice and actions
export {
  default as notificationReducer,
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