# Notification System

This document explains how the notification system works across the application.

## Architecture

The notification system uses Socket.io for real-time notifications and Redux for state management. Here's how it works:

1. Users connect to a dedicated notification socket when the app loads
2. Notifications are sent via socket events
3. Notifications are displayed in the badge component
4. Users can view all notifications in the notifications page

## Components

### Socket Connection

The `SocketProvider` in `src/lib/socket.tsx` handles socket connections. It establishes a dedicated notification connection when:

```tsx
// RootLayout.tsx
connectToChannel(notificationChannelId, userId, true);
```

The third parameter `true` indicates this is a notification connection.

### Notification Badge

The `NotificationBadge` component displays unread notification count:

```tsx
import { NotificationBadge } from "@/features/notifications";

<NotificationBadge />
```

### Sending Notifications

Use the `sendNotification` utility to send notifications:

```tsx
import { sendNotification } from "@/lib/socketUtils";

// When sending a message
sendNotification(socket, {
  groupId: "group-id",
  channelId: "channel-id",
  senderId: "sender-id",
  content: "Message content"
});
```

### Redux Integration

Notifications are stored in Redux for state management. The slice manages:

- Unread notification count
- Last received notification
- Notification drawer state

## Server-Side Implementation

The server listens for the `create_notification` event and:

1. Creates notification records in the database
2. Sends notifications to all relevant users
3. Handles notification delivery even for offline users

## Usage Example

```tsx
// In a message component
const handleSendMessage = () => {
  // Send the message to the server
  socket.emit("new_message", messageData);
  
  // Also trigger a notification
  sendNotification(socket, {
    groupId: currentGroup._id,
    channelId: currentChannel._id,
    senderId: userId,
    content: messageContent
  });
};
``` 