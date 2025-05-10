import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { incrementUnreadCount, setLastNotification } from '@/features/root/notifications';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connectToChannel: (channelId: string, userId: string, isNotification?: boolean) => void;
  currentChannelId: string | null;
}

const defaultSocketContext: SocketContextType = {
  socket: null,
  isConnected: false,
  connectToChannel: () => {},
  currentChannelId: null
};

const SocketContext = createContext<SocketContextType>(defaultSocketContext);

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentChannelId, setCurrentChannelId] = useState<string | null>(null);
  const dispatch = useDispatch();

  // Initialize socket only once without connecting
  useEffect(() => {
    const socketInstance = io('http://localhost:8000', {
      autoConnect: false, // Important: don't auto connect
      transports: ['websocket']
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Listen for notifications
    socketInstance.on('notification_created', (notification) => {
      console.log('Notification received:', notification);
      // Update Redux with the new notification
      dispatch(incrementUnreadCount());
      dispatch(setLastNotification(notification));
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [dispatch]);

  const connectToChannel = useCallback((channelId: string, userId: string, isNotification: boolean = false) => {
    if (!socket) return;
    
    // Determine the connection type
    const connectionType = isNotification ? 'notifications' : 'channel';
    
    // Check if we're already connected to this channel
    const currentAuth = socket.auth as { channelId?: string; userId?: string; type?: string } | undefined;
    
    // If we're already connected to this channel with the same user, do nothing
    if (
      socket.connected && 
      currentAuth?.channelId === channelId && 
      currentAuth?.userId === userId &&
      currentAuth?.type === connectionType
    ) {
      console.log(`Already connected to this ${connectionType}`);
      return;
    }
    
    // Always disconnect first to ensure a clean connection
    if (socket.connected) {
      socket.disconnect();
    }
    
    // Set auth data before connecting
    socket.auth = {
      type: connectionType,
      channelId,
      userId
    };
    
    // Update current channel ID
    setCurrentChannelId(channelId);
    
    // Now connect with the auth data
    socket.connect();
    
    console.log(`Connecting to ${connectionType} with auth:`, socket.auth);
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectToChannel, currentChannelId }}>
      {children}
    </SocketContext.Provider>
  );
};
