import { useEffect, useState } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

import { Button } from '@/components/ui/button';

interface MeetingSetupProps {
  setIsSetupComplete: (value: boolean) => void;
  onClose?: () => void;
}

const MeetingSetup = ({
  setIsSetupComplete,
  onClose,
}: MeetingSetupProps) => {
  // Get call state hooks
  const { useCallEndedAt, useCallStartsAt } = useCallStateHooks();
  const callStartsAt = useCallStartsAt();
  const isScheduledMeeting = callStartsAt && new Date(callStartsAt) > new Date();

  const call = useCall();

  if (!call) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-light-1">
        <p>Call not found. Please try again.</p>
        {onClose && (
          <Button 
            variant="outline" 
            onClick={onClose}
            className="mt-4"
          >
            Close
          </Button>
        )}
      </div>
    );
  }

  // Toggle for microphone and camera
  const [isMicCamToggled, setIsMicCamToggled] = useState(false);

  useEffect(() => {
    if (isMicCamToggled) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggled, call.camera, call.microphone]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-light-1">
      <h1 className="text-center text-2xl font-semibold">Setup Your Meeting</h1>
      
      <div className="h-64 w-full max-w-md overflow-hidden rounded-lg bg-dark-3">
        <VideoPreview />
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-3 my-4">
        <label className="flex items-center justify-center gap-2 font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={isMicCamToggled}
            onChange={(e) => setIsMicCamToggled(e.target.checked)}
            className="rounded border-dark-5 bg-dark-3 text-primary-500 focus:ring-primary-500"
          />
          <span>Join with mic and camera off</span>
        </label>
        <DeviceSettings />
      </div>
      
      <div className="flex gap-3 mt-2">
        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            className="border-dark-5 text-light-1 hover:bg-dark-5 rounded-xl"
          >
            Cancel
          </Button>
        )}
        <Button
          className="bg-primary-500 hover:bg-primary-600 text-light-1 rounded-xl shadow-md"
          onClick={() => {
            call.join();
            setIsSetupComplete(true);
          }}
        >
          Join Meeting
        </Button>
      </div>
    </div>
  );
};

export default MeetingSetup; 