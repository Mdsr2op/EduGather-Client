import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Call } from '@stream-io/video-react-sdk';
import { useStreamClient } from './StreamProvider';
import { setActiveCall } from '../slices/streamSlice';

export const CallNotification: React.FC = () => {
  const { client } = useStreamClient();
  const dispatch = useDispatch();
  const [incomingCall, setIncomingCall] = useState<Call | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  // In a real implementation, you would need to use Stream's SDK properly
  // to listen for incoming calls. For now, we'll just simulate it.
  
  // For testing/demo purposes, you can manually set an incoming call
  const simulateIncomingCall = () => {
    if (client && !incomingCall) {
      // This is just for demonstration - in a real app, calls would come from Stream's API
      console.log('You would get real incoming calls from Stream SDK');
    }
  };

  const handleAcceptCall = async () => {
    if (!incomingCall || !client) return;

    try {
      // In a real implementation:
      // await incomingCall.join();
      
      // Update Redux state
      dispatch(
        setActiveCall({
          callId: incomingCall.id,
          callType: 'video',
          participants: [],
        })
      );
      
      // Hide notification
      setShowNotification(false);
      setIncomingCall(null);
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  };

  const handleRejectCall = async () => {
    if (!incomingCall || !client) return;

    try {
      // In a real implementation:
      // await incomingCall.leave();
      
      // Hide notification
      setShowNotification(false);
      setIncomingCall(null);
    } catch (error) {
      console.error('Error rejecting call:', error);
    }
  };

  if (!showNotification || !incomingCall) {
    return null;
  }

  return (
    <div className="call-notification">
      <div className="call-notification-content">
        <h3>Incoming Call</h3>
        <p>Someone is calling you</p>
        <div className="call-notification-actions">
          <button 
            className="accept-button" 
            onClick={handleAcceptCall}
          >
            Accept
          </button>
          <button 
            className="reject-button" 
            onClick={handleRejectCall}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}; 