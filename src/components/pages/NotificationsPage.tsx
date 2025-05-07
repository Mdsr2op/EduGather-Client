import React from "react";
import { FiBell, FiMessageSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface Notification {
  id: string;
  type: 'channel_message';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  groupId: string;
  groupName: string;
  channelId: string;
  channelName: string;
  senderId?: string;
  senderName?: string;
}

// Dummy channel message notifications for display
const DUMMY_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "channel_message",
    title: "New message in General",
    message: "Alex: Does anyone have the notes from yesterday's lecture?",
    time: "2 hours ago",
    isRead: false,
    groupId: "g123",
    groupName: "CS 101 Study Group",
    channelId: "c456",
    channelName: "General",
    senderId: "u789",
    senderName: "Alex"
  },
  {
    id: "2",
    type: "channel_message",
    title: "New message in Project-updates",
    message: "Taylor: I've uploaded the final presentation slides",
    time: "15 minutes ago",
    isRead: false,
    groupId: "g456",
    groupName: "Project Team",
    channelId: "c789",
    channelName: "Project-updates",
    senderId: "u123",
    senderName: "Taylor"
  },
  {
    id: "3",
    type: "channel_message",
    title: "New message in Homework-help",
    message: "Jamie: Can someone explain problem #4 from the assignment?",
    time: "1 day ago",
    isRead: true,
    groupId: "g789",
    groupName: "Math Group",
    channelId: "c321",
    channelName: "Homework-help",
    senderId: "u456",
    senderName: "Jamie"
  },
  {
    id: "4",
    type: "channel_message",
    title: "New message in Resources",
    message: "Sarah: I've shared notes from today's lecture",
    time: "3 days ago",
    isRead: true,
    groupId: "g321",
    groupName: "History Class",
    channelId: "c654",
    channelName: "Resources",
    senderId: "u987",
    senderName: "Sarah"
  }
];

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to the specific channel where the message was posted
    navigate(`/${notification.groupId}/${notification.channelId}`);
  };

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
              {notification.groupName} • {notification.channelName}
            </span>
            <span className="text-light-4 text-xs">{notification.time}</span>
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
  // Count unread notifications
  const unreadCount = DUMMY_NOTIFICATIONS.filter(n => !n.isRead).length;

  // Handler for marking all notifications as read
  const handleMarkAllAsRead = () => {
    // In a real app, this would update the notifications in state/database
    console.log("Marking all notifications as read");
  };

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

      {DUMMY_NOTIFICATIONS.length > 0 ? (
        <div className="bg-dark-1 rounded-xl overflow-hidden shadow-lg">
          {DUMMY_NOTIFICATIONS.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <div className="text-light-3 text-center p-8 bg-dark-3 rounded-xl border border-dark-5">
          <div className="flex justify-center mb-4">
            <FiBell size={32} className="text-light-4" />
          </div>
          <p className="text-lg mb-2">No new messages</p>
          <p className="text-sm">You're all caught up!</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage; 