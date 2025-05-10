export interface Notification {
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
}

export interface NotificationResponse {
  status: number;
  data: {
    notifications: Notification[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    }
  };
  message: string;
}

export interface NotificationReadResponse {
  status: number;
  data: Notification;
  message: string;
}

export interface AllNotificationsReadResponse {
  status: number;
  data: {
    modifiedCount: number;
  };
  message: string;
} 