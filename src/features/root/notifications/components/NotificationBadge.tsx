import React from 'react';
import { FiBell } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUnreadCount } from '../slices/notificationSlice';

interface NotificationBadgeProps {
  className?: string;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ className = '' }) => {
  const unreadCount = useSelector(selectUnreadCount);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/notifications');
  };

  return (
    <button 
      onClick={handleClick}
      className={`relative p-2 rounded-full hover:bg-dark-4 transition-colors ${className}`}
      aria-label="View notifications"
    >
      <FiBell size={24} className="text-light-2" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBadge; 