import { useState, useEffect, useCallback } from "react";
import { StreamVideoParticipant } from "@stream-io/video-react-sdk";
import { Button } from "@/components/ui/button";

interface RotatingMicIndicatorProps {
  initialTime: number;
  currentSpeakerIndex: number;
  participants: StreamVideoParticipant[];
  onNextSpeaker: () => void;
  isHost: boolean;
}

const RotatingMicIndicator: React.FC<RotatingMicIndicatorProps> = ({
  initialTime,
  currentSpeakerIndex,
  participants,
  onNextSpeaker,
  isHost,
}) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);
  
  // All hooks must be called at the top level before any conditional logic
  const handleTimeExpired = useCallback(() => {
    if (remainingTime === 0) {
      onNextSpeaker();
    }
  }, [remainingTime, onNextSpeaker]);
  
  // Get current speaker name safely
  const currentSpeaker =
    participants[currentSpeakerIndex]?.name ||
    participants[currentSpeakerIndex]?.userId ||
    "Unknown";

  // Reset the timer whenever the initialTime or currentSpeakerIndex changes
  useEffect(() => {
    setRemainingTime(initialTime);
  }, [initialTime, currentSpeakerIndex]);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Separate useEffect for checking timer to avoid infinite loops
  useEffect(() => {
    handleTimeExpired();
  }, [handleTimeExpired]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed top-20 right-20 bg-[#19232d] border border-gray-700 p-4 rounded shadow-lg z-50">
      <div className="mb-2">
        <strong>Current Speaker:</strong> {currentSpeaker}
      </div>
      <div className="mb-2">
        <strong>Remaining Time:</strong> {formatTime(remainingTime)}
      </div>
      {isHost && (
        <Button
          onClick={onNextSpeaker}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Next Speaker
        </Button>
      )}
    </div>
  );
};

export default RotatingMicIndicator; 