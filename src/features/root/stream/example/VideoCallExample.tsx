import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';
import { 
  StartCallButton, 
  VideoCall, 
  useStreamClient 
} from '..';

const VideoCallExample: React.FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const { isLoading } = useStreamClient();
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  
  // Mock users for demonstration purposes
  const mockUsers = [
    { _id: 'user-1', fullName: 'John Doe', avatar: 'https://via.placeholder.com/50' },
    { _id: 'user-2', fullName: 'Jane Smith', avatar: 'https://via.placeholder.com/50' },
    { _id: 'user-3', fullName: 'Alex Johnson', avatar: 'https://via.placeholder.com/50' },
  ];
  
  // Filter out current user from mock users
  const otherUsers = mockUsers.filter(user => 
    !currentUser || user._id !== currentUser._id
  );
  
  const handleStartCall = (callId: string) => {
    setActiveCallId(callId);
  };
  
  const handleEndCall = () => {
    setActiveCallId(null);
  };
  
  if (isLoading) {
    return <div>Loading Stream client...</div>;
  }
  
  if (!currentUser) {
    return <div>Please log in to start video calls</div>;
  }
  
  return (
    <div className="video-call-example">
      {!activeCallId ? (
        <>
          <h2>Start a Video Call</h2>
          <div className="user-list">
            {otherUsers.map(user => (
              <div key={user._id} className="user-card">
                <img src={user.avatar} alt={user.fullName} className="user-avatar" />
                <div className="user-name">{user.fullName}</div>
                <StartCallButton 
                  participants={[user._id]}
                  onCallStarted={handleStartCall}
                >
                  Call {user.fullName.split(' ')[0]}
                </StartCallButton>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="active-call-container">
          <VideoCall callId={activeCallId} />
          <button className="end-call-button" onClick={handleEndCall}>
            End Call
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoCallExample; 