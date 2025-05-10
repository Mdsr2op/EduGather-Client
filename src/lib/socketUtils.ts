import { Socket } from 'socket.io-client';

/**
 * Sends a notification via socket for a new message
 * 
 * @param socket The socket.io client instance
 * @param data Notification data including groupId, channelId, senderId, and content
 * @returns void
 */
export const sendNotification = (
  socket: Socket | null,
  data: {
    type?: string;
    groupId: string;
    channelId: string;
    senderId: string;
    content: string;
  }
): void => {
  if (!socket) {
    console.error('Socket not available for notification');
    return;
  }

  if (!socket.connected) {
    console.error('Socket not connected for notification');
    return;
  }

  const notificationData = {
    type: data.type || 'channel_message',
    groupId: data.groupId,
    channelId: data.channelId,
    senderId: data.senderId,
    content: data.content
  };

  // Emit the create_notification event to the server
  socket.emit('create_notification', notificationData);
  console.log('Notification sent:', notificationData);
}; 