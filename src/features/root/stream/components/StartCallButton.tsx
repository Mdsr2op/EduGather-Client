import React from 'react';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { setActiveCall } from '../slices/streamSlice';
import { useStreamClient } from './StreamProvider';

interface StartCallButtonProps {
  participants: string[];
  callType?: 'video' | 'audio';
  className?: string;
  children?: React.ReactNode;
  onCallStarted?: (callId: string) => void;
}

export const StartCallButton: React.FC<StartCallButtonProps> = ({
  participants,
  callType = 'video',
  className = '',
  children,
  onCallStarted,
}) => {
  const dispatch = useDispatch();
  const { client, isLoading } = useStreamClient();

  const handleStartCall = async () => {
    if (!client || isLoading) return;

    try {
      // Generate a unique call ID
      const callId = uuidv4();
      
      // Set the active call in Redux
      dispatch(
        setActiveCall({
          callId,
          callType,
          participants,
        })
      );
      
      // Call the onCallStarted callback if provided
      if (onCallStarted) {
        onCallStarted(callId);
      }
      
      // Redirect to call page or open modal
      // This could navigate to a specific route like /call/:callId
      // or open a modal with the VideoCall component
      
      // Example: Navigate to call page (implementation depends on your router)
      // navigate(`/call/${callId}`);
      
      // Or: Open a modal (implementation depends on your UI framework)
      // setCallModalOpen(true);
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  return (
    <button
      className={`start-call-button ${className}`}
      onClick={handleStartCall}
      disabled={isLoading}
    >
      {children || (callType === 'video' ? 'Start Video Call' : 'Start Audio Call')}
    </button>
  );
}; 