import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  unreadCount: number;
  lastNotification: Notification | null;
  showNotificationDrawer: boolean;
}

const initialState: NotificationState = {
  unreadCount: 0,
  lastNotification: null,
  showNotificationDrawer: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    setLastNotification: (state, action: PayloadAction<Notification>) => {
      state.lastNotification = action.payload;
    },
    toggleNotificationDrawer: (state) => {
      state.showNotificationDrawer = !state.showNotificationDrawer;
    },
    setNotificationDrawer: (state, action: PayloadAction<boolean>) => {
      state.showNotificationDrawer = action.payload;
    },
  },
});

export const {
  setUnreadCount,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount,
  setLastNotification,
  toggleNotificationDrawer,
  setNotificationDrawer,
} = notificationSlice.actions;

// Selectors
export const selectUnreadCount = (state: any) => state.notification.unreadCount;
export const selectLastNotification = (state: any) => state.notification.lastNotification;
export const selectShowNotificationDrawer = (state: any) => state.notification.showNotificationDrawer;

export default notificationSlice.reducer; 