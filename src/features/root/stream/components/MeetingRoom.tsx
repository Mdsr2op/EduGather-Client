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
  useCall,
} from "@stream-io/video-react-sdk";
import { useNavigate, useLocation } from "react-router-dom";
import { Users, LayoutList } from "lucide-react";
import { useSocket } from "@/lib/socket";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";
import { toast } from "react-hot-toast";

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
  const call = useCall();
  
  const [layout, setLayout] = useState("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [isRotatingMicEnabled, setIsRotatingMicEnabled] = useState(false);
  const [rotateMicMinutes, setRotateMicMinutes] = useState(5);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);

  // Add state for members info
  const [expectedMembers, setExpectedMembers] = useState<string[]>([]);

  const { 
    useCallCallingState, 
    useHasPermissions, 
    useParticipants,
    useLocalParticipant,
    useCallMembers
  } = useCallStateHooks();
  
  const callingState = useCallCallingState();
  const isHost = useHasPermissions(OwnCapability.UPDATE_CALL_PERMISSIONS);
  const participants = useParticipants();
  const localParticipant = useLocalParticipant();
  const members = useCallMembers();
  
  // Memoize participants to prevent unnecessary re-renders and sort by username
  const validParticipants = useMemo(() => {
    return participants
      .filter(p => p && p.userId)
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [participants]);
  
  // Handle call max duration limit
  useEffect(() => {
    if (!call || !socket) return;
    
    // Get the start time and max duration from call state
    const maxDurationSeconds = call.state.settings?.limits?.max_duration_seconds || 1000; // Default to 1000 seconds
    const startTime = call.state.startsAt ? new Date(call.state.startsAt) : new Date();
    
    // Calculate when the call should end
    const endTime = new Date(startTime.getTime() + (maxDurationSeconds * 1000));
    
    // Calculate remaining time
    const remainingTime = endTime.getTime() - Date.now();
    
    // Only set timeout if there's remaining time
    if (remainingTime > 0) {
      // Set a timeout to end the call when max duration is reached
      const timeoutId = setTimeout(async () => {
        // End the call
        try {
          await call.endCall();
          
          // Emit meeting end event to all participants
          if (socket) {
            socket.emit("meetingEnded");
            
            // Also emit a message to update the meeting status in the channel
            const callId = call.id;
            
            socket.emit("updateMeetingStatus", {
              meetingId: callId,
              status: "ended",
              endTime: new Date().toISOString(),
              participantsCount: validParticipants.length
            });
          }
          
          // Show notification
          toast.success('Meeting ended due to maximum duration reached', { position: 'bottom-center' });
          
          // Navigate back
          navigate('/');
        } catch (error) {
          console.error("Error ending call after max duration:", error);
        }
      }, remainingTime);
      
      // Clean up the timeout if the component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [call, socket, navigate, validParticipants.length]);
  
  // Handle call end event and navigation
  useEffect(() => {
    if (!call) return;

    // Subscribe to the 'call.ended' event
    const unsubscribe = call.on('call.ended', () => {
      // Extract meeting info from call state
      const groupId = call.state.custom?.groupId;
      const channelId = call.state.custom?.channelId;
      
      // Clear active meeting status in the channel
      if (socket && channelId) {
        socket.emit("setActiveMeetingInChannel", {
          channelId,
          meetingId: call.id,
          active: false
        });
        
        // Update meeting status to "ended" in the message attachment
        socket.emit("updateMeetingStatus", {
          meetingId: call.id,
          status: "ended",
          endTime: new Date().toISOString(),
          participantsCount: validParticipants.length
        });
      }
      
      // Show notification
      toast.success('Call ended', { position: 'bottom-center' });
      
      // Navigate back to the channel when the call ends
      if (groupId && channelId) {
        navigate(`/${groupId}/${channelId}`);
      } else {
        navigate('/');
      }
    });

    // Cleanup subscription on component unmount
    return () => {
      unsubscribe();
    };
  }, [call, navigate, socket, validParticipants.length]);
  
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

  // Handle duplicate participants using server-side implementation
  useEffect(() => {
    if (!call || !localParticipant || !user || !socket) return;
    
    const meetingId = call.id;
    const currentUserId = user._id;
    const currentSessionId = localParticipant.sessionId;
    
    // Notify the server that we've joined this meeting
    socket.emit("joinedMeeting", {
      meetingId,
      sessionId: currentSessionId
    });
    
    // Listen for duplicate session events
    socket.on("duplicateSessionKicked", (data) => {
      if (data.sessionId === currentSessionId) {
        console.log("This session has been kicked due to a duplicate login");
        
        // Show toast notification
        toast.error("This meeting was joined in another tab. Redirecting...", {
          duration: 3000,
          position: "bottom-center",
        });
        
        // Leave the call before redirecting
        try {
          if (data.action === "leave_immediately") {
            // Forcefully leave the call immediately
            call.leave();
            // Navigate away with minimal delay
            setTimeout(() => navigate("/"), 500);
          } else {
            // Default behavior with a longer delay
            call.leave();
            setTimeout(() => navigate("/"), 1500);
          }
        } catch (error) {
          console.error("Error leaving call:", error);
          // Ensure navigation even on error
          setTimeout(() => navigate("/"), 1000);
        }
      }
    });

    // Listen for requests to remove old duplicate participants from the call
    socket.on("removeOldParticipantSession", async (data) => {
      try {
        // We are the active session and need to clean up duplicates
        if (data.userId === currentUserId && data.meetingId === meetingId) {
          // First verify if we can find a participant with this session ID
          const duplicateParticipant = participants.find(p => p.sessionId === data.sessionId);
          
          if (duplicateParticipant) {
            console.log(`Found duplicate participant with session ${data.sessionId}`);
            
            // Display toast notification for the active user
            toast.success("Multiple sessions detected. The other session has been disconnected.", {
              duration: 3000,
              position: "bottom-center"
            });
          }
        }
      } catch (error) {
        console.error("Error handling removeOldParticipantSession:", error);
      }
    });
    
    // Clean up when component unmounts
    return () => {
      // Notify server we're leaving
      socket.emit("leftMeeting", {
        meetingId,
        sessionId: currentSessionId
      });
      
      // Remove event listeners
      socket.off("duplicateSessionKicked");
      socket.off("removeOldParticipantSession");
    };
  }, [call, localParticipant, user, socket, navigate, participants, isHost]);

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
  
  // Update meeting status to "ongoing" when joined
  useEffect(() => {
    if (callingState === CallingState.JOINED && socket && location.pathname.includes('/meeting/')) {
      // Extract meeting ID from URL
      const pathSegments = location.pathname.split('/');
      const meetingId = pathSegments[pathSegments.length - 1];
      
      // Update meeting status
      socket.emit("updateMeetingStatus", {
        meetingId,
        status: "ongoing",
        participantsCount: validParticipants.length
      });
    }
  }, [callingState, socket, location.pathname, validParticipants.length]);

  useEffect(() => {
    if (members && members.length > 0) {
      console.log(`Meeting has ${members.length} members added`);
    }
  }, [members]);

  useEffect(() => {
    if (call?.state?.custom?.memberIds) {
      setExpectedMembers(call.state.custom.memberIds);
    }
  }, [call]);

  // Check which members have joined and which are still expected
  const joinedMemberIds = useMemo(() => {
    return participants
      .filter(p => p && p.userId)
      .map(p => p.userId);
  }, [participants]);
  
  // Calculate missing members
  const missingMembers = useMemo(() => {
    if (!expectedMembers || !joinedMemberIds) return [];
    return expectedMembers.filter(id => !joinedMemberIds.includes(id));
  }, [expectedMembers, joinedMemberIds]);

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

  // Add this inside your rendered UI, perhaps in the participants section
  const renderMembersStatus = () => {
    if (!showParticipants) return null;
    
    return (
      <div className="p-3 mt-3 bg-[#19232d] rounded-lg">
        <h3 className="text-sm font-medium mb-2">Group Members Status</h3>
        <div className="text-xs">
          <p>{joinedMemberIds.length} of {expectedMembers.length} members have joined</p>
          {missingMembers.length > 0 && (
            <p className="mt-1 text-light-3">
              {missingMembers.length} members still expected to join
            </p>
          )}
        </div>
      </div>
    );
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
          {renderMembersStatus()}
        </div>
      </div>

      {/* Bottom controls bar */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 pb-4 flex-wrap">
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