'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { Loader } from 'lucide-react';

import { useGetCallById } from '@/hooks/useGetCallById';
import MeetingSetup from '@/features/root/chats/components/MeetingSetup';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';

const MeetingPage = () => {
  const { id } = useParams();
  const user = useSelector(selectCurrentUser);
  const { call, isCallLoading } = useGetCallById(id || '');
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  if (isCallLoading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin" />
    </div>
  );

  if (!call) return (
    <p className="text-center text-3xl font-bold text-white">
      Call Not Found
    </p>
  );

  // get more info about custom call type: https://getstream.io/video/docs/react/guides/configuring-call-types/
  const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user._id));

  if (notAllowed) return (
    <p className="text-center text-3xl font-bold text-white">
      You are not allowed to join this meeting
    </p>
  );

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-3xl font-bold text-white">Meeting Room</p>
            </div>
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage; 