import { useState, useCallback, useMemo, useEffect } from "react";
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  CallingState,
  OwnCapability,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useNavigate, useLocation } from "react-router-dom";
import { Users, LayoutList } from "lucide-react";
import { useSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import RotatingMicIndicator from "./RotatingMicIndicator";
import EndCallButton from "./EndCallButton";

const MeetingRoom = () => {
  const location = useLocation();
  const isPersonalRoom = location.search.includes("personal=true");
  const navigate = useNavigate();
  const { socket } = useSocket();
  const user = useSelector(selectCurrentUser);
  
  const [layout, setLayout] = useState("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [isRotatingMicEnabled, setIsRotatingMicEnabled] = useState(false);
  const [rotateMicMinutes, setRotateMicMinutes] = useState(5);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);

  const { 
    useCallCallingState, 
    useHasPermissions, 
    useParticipants 
  } = useCallStateHooks();
  
  const callingState = useCallCallingState();
  const isHost = useHasPermissions(OwnCapability.UPDATE_CALL_PERMISSIONS);
  const participants = useParticipants();
  
  // Memoize participants to prevent unnecessary re-renders and sort by username
  const validParticipants = useMemo(() => {
    return participants
      .filter(p => p && p.userId)
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [participants]);

  // Calculate timer key based on current speaker index
  const timerKey = useMemo(() => currentSpeakerIndex, [currentSpeakerIndex]);

  // Use useCallback to prevent function recreation on every render
  const handleNextSpeaker = useCallback(() => {
    if (validParticipants.length <= 1) return;
    setCurrentSpeakerIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % validParticipants.length;
      if (isHost && socket) {
        socket.emit("rotateMicStatus", {
          isRotatingMicEnabled,
          rotateMicMinutes,
          currentSpeakerIndex: nextIndex,
        });
      }
      return nextIndex;
    });
  }, [validParticipants, isHost, isRotatingMicEnabled, rotateMicMinutes, socket]);

  useEffect(() => {
    if (!socket){
        return;
    }
    
    // For non-hosts, set up the listener
    if (!isHost) {
      socket.on("rotateMicStatus", (data) => {
        console.log("rotateMicStatus", data);
        setIsRotatingMicEnabled(data.isRotatingMicEnabled);
        setRotateMicMinutes(data.rotateMicMinutes);
        setCurrentSpeakerIndex(data.currentSpeakerIndex);
      });
    }

    // Listen for meeting end event
    socket.on("meetingEnded", () => {
      navigate("/");
    });
    
    return () => {
      if (socket) {
        socket.off("rotateMicStatus");
        socket.off("meetingEnded");
      }
    };
  }, [isHost, socket, navigate]);
  
  // Create layout component outside of render method
  const renderCallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition="left" />;
      default:
        return <SpeakerLayout participantsBarPosition="right" />;
    }
  };

  if (callingState !== CallingState.JOINED) return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin" />
    </div>
  );

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      {/* Show the indicator pop-up when rotating mic is enabled and we have participants */}
      {isRotatingMicEnabled && validParticipants.length > 0 && (
        <RotatingMicIndicator
          key={timerKey}
          initialTime={rotateMicMinutes * 60}
          currentSpeakerIndex={currentSpeakerIndex}
          participants={validParticipants}
          onNextSpeaker={handleNextSpeaker}
          isHost={isHost}
        />
      )}
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          {renderCallLayout()}
        </div>
        {/* Right participants list pane */}
        <div
          className={cn("h-[calc(100vh-86px)] hidden ml-2", {
            "block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* Bottom controls bar */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 pb-4">
        <CallControls onLeave={() => navigate(`/`)} />

        <div className="dropdown-menu">
          <Button
            variant="outline"
            className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]"
            onClick={() => {
              const layouts = ["grid", "speaker-left", "speaker-right"];
              const currentIndex = layouts.indexOf(layout);
              const nextIndex = (currentIndex + 1) % layouts.length;
              setLayout(layouts[nextIndex]);
            }}
          >
            <LayoutList size={20} className="text-white" />
          </Button>
        </div>

        <CallStatsButton />

        {/* Show participants button */}
        <Button
          variant="outline"
          onClick={() => setShowParticipants((prev) => !prev)}
          className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]"
        >
          <Users size={20} className="text-white" />
        </Button>

        {/* Enable rotating mic */}
        {isHost && (
          <div className="flex items-center space-x-3 rounded-2xl bg-[#19232d] px-4 py-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isRotatingMicEnabled}
                onChange={(e) => {
                  const enabled = e.target.checked;
                  setIsRotatingMicEnabled(enabled);
                  if (isHost && socket) {
                    socket.emit("rotateMicStatus", {
                      isRotatingMicEnabled: enabled,
                      rotateMicMinutes,
                      currentSpeakerIndex,
                    });
                  }
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-white font-medium">
                Enable rotating mic
              </span>
            </label>

            {isRotatingMicEnabled && (
              <select
                value={rotateMicMinutes}
                onChange={(e) => {
                  const minutes = parseInt(e.target.value);
                  setRotateMicMinutes(minutes);
                  if (isHost && socket) {
                    socket.emit("rotateMicStatus", {
                      isRotatingMicEnabled,
                      rotateMicMinutes: minutes,
                      currentSpeakerIndex,
                    });
                  }
                }}
                className="rounded-md bg-[#19232d] px-2 py-1 text-sm font-medium text-white outline-none ring-1 ring-[#4c535b]"
              >
                {[...Array(30)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} minute{i ? "s" : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* End call button if not personal room */}
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom; 