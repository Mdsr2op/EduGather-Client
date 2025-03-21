import React from 'react';
import { StreamVideo } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useStreamClient } from './StreamProvider';

interface StreamVideoWrapperProps {
  children: React.ReactNode;
}

export const StreamVideoWrapper: React.FC<StreamVideoWrapperProps> = ({ children }) => {
  const { client, isLoading } = useStreamClient();

  if (isLoading) {
    return <div>Loading Stream Video...</div>;
  }

  if (!client) {
    return <>{children}</>; // Render children without Stream wrapping if no client
  }

  return (
    <StreamVideo client={client}>
      {children}
    </StreamVideo>
  );
}; 