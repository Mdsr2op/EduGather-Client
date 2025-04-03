'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { Loader } from 'lucide-react';

import { useGetCallById } from '@/hooks/useGetCallById';
import MeetingSetup from '@/features/root/chats/components/MeetingSetup';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';
import { selectSelectedChannelId } from '@/features/root/channels/slices/channelSlice';
import MeetingRoom from '@/features/root/stream/components/MeetingRoom';
import { useSocket } from '@/lib/socket';

const MeetingPage = () => {
  const { id, channelId: channelIdFromParams } = useParams();
  const user = useSelector(selectCurrentUser);
  const { call, isCallLoading } = useGetCallById(id || '');
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const selectedChannelId = useSelector(selectSelectedChannelId) || channelIdFromParams;
  const userId = user?._id;
  const { socket, connectToChannel } = useSocket();
  const prevChannelIdRef = useRef<string | null>(null);

  useEffect(() => {
    if(selectedChannelId && userId) {
      connectToChannel(selectedChannelId, userId);
      prevChannelIdRef.current = selectedChannelId;
    }
  }, [selectedChannelId, userId, connectToChannel]);
  
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
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default MeetingPage;