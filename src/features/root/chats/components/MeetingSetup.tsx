import { useEffect, useState, useRef } from 'react';
import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from '@stream-io/video-react-sdk';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Video, VideoOff, Settings, X } from 'lucide-react';

interface MeetingSetupProps {
  setIsSetupComplete: (value: boolean) => void;
  onClose?: () => void;
}

const MeetingSetup = ({
  setIsSetupComplete,
  onClose,
}: MeetingSetupProps) => {
  const call = useCall();
  const [isJoining, setIsJoining] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const audioLevelInterval = useRef<NodeJS.Timeout | null>(null);

  // Toggle microphone
  const toggleMic = () => {
    if (!call) return;
    if (isMicEnabled) {
      call.microphone.disable();
    } else {
      call.microphone.enable();
    }
    setIsMicEnabled(!isMicEnabled);
  };

  // Toggle camera
  const toggleCamera = () => {
    if (!call) return;
    if (isCameraEnabled) {
      call.camera.disable();
    } else {
      call.camera.enable();
    }
    setIsCameraEnabled(!isCameraEnabled);
  };

  // Audio level meter animation
  useEffect(() => {
    if (isMicEnabled && call) {
      audioLevelInterval.current = setInterval(() => {
        // Simulate audio level for visual feedback
        const level = Math.random() * 100;
        setAudioLevel(level > 15 ? level : 0); // Only show significant audio
      }, 200);
    } else {
      setAudioLevel(0);
      if (audioLevelInterval.current) {
        clearInterval(audioLevelInterval.current);
      }
    }

    return () => {
      if (audioLevelInterval.current) {
        clearInterval(audioLevelInterval.current);
      }
    };
  }, [isMicEnabled, call]);

  // Handle join meeting
  const handleJoinMeeting = async () => {
    if (!call) return;

    setIsJoining(true);
    try {
      await call.join();
      setIsSetupComplete(true);
    } catch (error) {
      setIsJoining(false);
      // Handle error - in a real app, you'd want to show an error message
      console.error("Failed to join meeting:", error);
    }
  };

  if (!call) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-gray-900 dark:text-light-1 bg-white dark:bg-dark-2 rounded-lg shadow-lg">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 text-red-500">
          <X size={32} />
        </div>
        <p className="text-xl font-medium text-center">Call not found</p>
        <p className="text-center text-gray-600 dark:text-gray-400">The call might have ended or the link is invalid.</p>
        {onClose && (
          <Button 
            variant="outline" 
            onClick={onClose}
            className="mt-2 border-gray-200 dark:border-dark-5 hover:bg-gray-100 dark:hover:bg-dark-4"
          >
            Return Home
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-between py-6 px-4 md:px-8 bg-white dark:bg-dark-2 rounded-lg max-w-2xl mx-auto shadow-lg">
      {/* Header */}
      <div className="w-full text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-light-1">Get Ready to Join</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Check your audio and video before joining</p>
      </div>
      
      {/* Main content */}
      <div className="w-full flex-1 flex flex-col items-center">
        {/* Video preview with overlay controls */}
        <div className="relative w-full max-w-md rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-3 aspect-video shadow-lg mb-6">
          <VideoPreview />
          
          {/* Camera disabled overlay */}
          {!isCameraEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-dark-3/80">
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="p-3 rounded-full bg-gray-200 dark:bg-dark-4">
                  <VideoOff size={28} className="text-gray-500 dark:text-gray-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Camera is off</p>
              </div>
            </div>
          )}
          
          {/* Audio level indicator */}
          {isMicEnabled && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1 rounded-full transition-all duration-200 ${
                    audioLevel > i * 20 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  style={{
                    height: `${12 + (i * 2)}px`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Control buttons */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button
            onClick={toggleMic}
            variant="outline"
            size="lg"
            className={`p-3 rounded-full ${
              isMicEnabled 
                ? 'bg-gray-100 dark:bg-dark-4 hover:bg-gray-200 dark:hover:bg-dark-5' 
                : 'bg-red-100 dark:bg-red-500/20 text-red-500 hover:bg-red-200 dark:hover:bg-red-500/30'
            }`}
            aria-label={isMicEnabled ? "Turn microphone off" : "Turn microphone on"}
          >
            {isMicEnabled ? <Mic size={24} /> : <MicOff size={24} />}
          </Button>
          
          <Button
            onClick={toggleCamera}
            variant="outline"
            size="lg"
            className={`p-3 rounded-full ${
              isCameraEnabled 
                ? 'bg-gray-100 dark:bg-dark-4 hover:bg-gray-200 dark:hover:bg-dark-5' 
                : 'bg-red-100 dark:bg-red-500/20 text-red-500 hover:bg-red-200 dark:hover:bg-red-500/30'
            }`}
            aria-label={isCameraEnabled ? "Turn camera off" : "Turn camera on"}
          >
            {isCameraEnabled ? <Video size={24} /> : <VideoOff size={24} />}
          </Button>
          
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            size="lg"
            className="p-3 rounded-full bg-gray-100 dark:bg-dark-4 hover:bg-gray-200 dark:hover:bg-dark-5"
            aria-label="Device settings"
          >
            <Settings size={24} />
          </Button>
        </div>

        {/* Device settings panel */}
        {showSettings && (
          <div className="w-full max-w-md bg-gray-50 dark:bg-dark-3 rounded-lg p-4 mb-6 shadow-lg">
            <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-light-1">Device Settings</h3>
            <DeviceSettings />
          </div>
        )}
      </div>
      
      {/* Footer with action buttons */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
        {onClose && (
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto border-gray-200 dark:border-dark-5 text-gray-900 dark:text-light-1 hover:bg-gray-100 dark:hover:bg-dark-4"
            disabled={isJoining}
          >
            Cancel
          </Button>
        )}
        <Button
          className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-medium shadow-md flex items-center justify-center gap-2"
          onClick={handleJoinMeeting}
          disabled={isJoining}
        >
          {isJoining ? (
            <>
              <span className="animate-pulse">Joining...</span>
            </>
          ) : (
            <>
              Join Meeting
              {!isMicEnabled && !isCameraEnabled && (
                <span className="text-xs bg-white/20 dark:bg-dark-4 px-2 py-1 rounded-full">Mic & Cam Off</span>
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MeetingSetup; 