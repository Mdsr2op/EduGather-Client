'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useGetCallById } from '@/hooks/useGetCallById';
import MeetingSetup from '@/features/root/chats/components/MeetingSetup';
import { selectCurrentUser } from '@/features/auth/slices/authSlice';
import { selectSelectedChannelId } from '@/features/root/channels/slices/channelSlice';
import MeetingRoom from '@/features/root/stream/components/MeetingRoom';
import { useSocket } from '@/lib/socket';
import { Button } from '@/components/ui/button';

const MeetingPage = () => {
  const { id: meetingId, channelId: channelIdFromParams, groupId } = useParams();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const { call, isCallLoading } = useGetCallById(meetingId || '');
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const selectedChannelId = useSelector(selectSelectedChannelId) || channelIdFromParams;
  const userId = user?._id;
  const { socket, connectToChannel } = useSocket();
  const prevChannelIdRef = useRef<string | null>(null);
  const [isAnotherActiveMeeting, setIsAnotherActiveMeeting] = useState(false);
  const [activeOtherMeetingId, setActiveOtherMeetingId] = useState<string | null>(null);

  useEffect(() => {
    if(selectedChannelId && userId) {
      connectToChannel(selectedChannelId, userId);
      prevChannelIdRef.current = selectedChannelId;
    }
  }, [selectedChannelId, userId, connectToChannel]);
  
  // Check if there's already an active meeting in this channel
  useEffect(() => {
    if (!socket || !selectedChannelId || !meetingId) return;
    
    // Check for active meetings in this channel
    socket.emit("checkActiveMeetingsInChannel", 
      { channelId: selectedChannelId }, 
      (response: { active: boolean, meetingId?: string }) => {
        // If there's an active meeting that's not this one
        if (response.active && response.meetingId && response.meetingId !== meetingId) {
          setIsAnotherActiveMeeting(true);
          setActiveOtherMeetingId(response.meetingId);
        } else {
          setIsAnotherActiveMeeting(false);
          setActiveOtherMeetingId(null);
        }
      }
    );
    
    // Mark this meeting as active when we join it
    if (isSetupComplete && meetingId) {
      socket.emit("setActiveMeetingInChannel", {
        channelId: selectedChannelId,
        meetingId,
        active: true
      });
    }
  }, [socket, selectedChannelId, meetingId, isSetupComplete]);
  
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

  // Check if there's already an active meeting in this channel
  if (isAnotherActiveMeeting && activeOtherMeetingId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 bg-dark-2 text-light-1">
        <div className="p-6 bg-dark-3 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Another Meeting Is In Progress</h2>
          <p className="mb-6">There is already an active meeting in this channel. You can only have one meeting active at a time.</p>
          
          <div className="flex flex-col gap-3">
            <Button 
              className="w-full bg-primary-500 hover:bg-primary-600"
              onClick={() => {
                if (groupId && selectedChannelId && activeOtherMeetingId) {
                  navigate(`/${groupId}/${selectedChannelId}/meeting/${activeOtherMeetingId}`);
                }
              }}
            >
              Join Active Meeting
            </Button>
            
            <Button
              variant="outline" 
              className="w-full border-dark-5"
              onClick={() => {
                if (groupId && selectedChannelId) {
                  navigate(`/${groupId}/${selectedChannelId}`);
                } else {
                  navigate('/');
                }
              }}
            >
              Return to Channel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if the user is allowed to join based on the memberIds stored in custom data
  // or if they are the meeting creator
  const memberIds = call.state.custom?.memberIds || [];
  const createdBy = call.state.custom?.createdBy;
  const isGroupMember = userId && Array.isArray(memberIds) && memberIds.includes(userId);
  const isCreator = userId && createdBy === userId;
  
  // User is not allowed if they're not a group member or the creator
  const notAllowed = !isGroupMember && !isCreator;

  if (notAllowed) return (
    <p className="text-center text-3xl font-bold text-white">
      You are not allowed to join this meeting. Only group members can join.
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