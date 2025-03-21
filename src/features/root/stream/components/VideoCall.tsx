import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Call, 
  CallControls, 
  CallingState, 
  CallParticipantsList, 
  SpeakerLayout,
  StreamCall
} from '@stream-io/video-react-sdk';
import { useStreamClient } from './StreamProvider';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';
import { selectActiveCall } from '../slices/streamSlice';

interface VideoCallProps {
  callId?: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({ callId: propCallId }) => {
  const { client, isLoading } = useStreamClient();
  const currentUser = useSelector(selectCurrentUser);
  const activeCall = useSelector(selectActiveCall);
  const [call, setCall] = useState<Call | null>(null);
  
  // Use the callId from props or from the Redux store's activeCall
  const callIdToUse = propCallId || activeCall.callId;

  useEffect(() => {
    if (!client || !callIdToUse || !currentUser) return;

    const initCall = async () => {
      try {
        // Get the call object
        const newCall = client.call('default', callIdToUse);
        
        // Join the call
        await newCall.join({ create: true });
        
        // Save the call
        setCall(newCall);
      } catch (error) {
        console.error('Error joining call:', error);
      }
    };

    initCall();

    // Clean up when component unmounts
    return () => {
      if (call) {
        call.leave();
      }
    };
  }, [client, callIdToUse, currentUser]);

  if (isLoading || !call) {
    return <div>Loading call...</div>;
  }

  return (
    <div className="video-call-container">
      <StreamCall call={call}>
        <div className="video-layout">
          <SpeakerLayout />
        </div>
        <div className="call-controls">
          <CallControls />
        </div>
        <div className="participants-list">
          <CallParticipantsList onClose={() => {}} />
        </div>
      </StreamCall>
    </div>
  );
}; 