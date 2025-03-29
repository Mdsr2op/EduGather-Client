import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSocket } from '@/lib/socket';

const EndCallButton = () => {
  const call = useCall();
  const navigate = useNavigate();
  const { socket } = useSocket();

  if (!call) {
    throw new Error(
      'useCall must be used within a StreamCall component',
    );
  }

  // Get local participant info to check if the user is the meeting owner
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  const endCall = async () => {
    await call.endCall();
    // Emit meeting end event to all participants
    if (socket) {
      socket.emit("meetingEnded");
    }
    navigate('/');
  };

  return (
    <Button onClick={endCall} variant="destructive" className="bg-red-500 hover:bg-red-600">
      End call for everyone
    </Button>
  );
};

export default EndCallButton; 