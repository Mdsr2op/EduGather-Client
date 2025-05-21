"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FiCalendar, FiVideo } from "react-icons/fi";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker.css";
import { toast } from 'react-hot-toast';
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";
import { useSocket } from "@/lib/socket";
import { useGetGroupDetailsQuery } from "@/features/root/groups/slices/groupApiSlice";
import { useGetChannelDetailsQuery } from "@/features/root/channels/slices/channelApiSlice";
import { MAX_MEETING_DURATION_SECONDS } from "@/config/meetingConfig";
import { useTheme } from "@/context/ThemeContext";

// Define the validation schema using Zod
const meetingSchema = z.object({
  meetingTitle: z
    .string()
    .min(1, "Meeting title is required")
    .max(100, "Meeting title is too long"),
  dateTime: z.date({
    required_error: "Date and time are required",
    invalid_type_error: "Invalid date format",
  }),
  agenda: z.string().max(500, "Agenda is too long").optional(),
});

// Type for the form data
type MeetingFormValues = z.infer<typeof meetingSchema>;

// Meeting types
type MeetingType = "isScheduleMeeting" | "isInstantMeeting" | undefined;

const StartVideoCallDialog: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [meetingType, setMeetingType] = useState<MeetingType>(undefined);
  const [isActiveMeetingInChannel, setIsActiveMeetingInChannel] = useState(false);
  const [activeMeetingId, setActiveMeetingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const client = useStreamVideoClient();
  const user = useSelector(selectCurrentUser);
  const { groupId, channelId } = useParams();
  const { socket } = useSocket();
  const { theme } = useTheme();

  // Get group and channel details from Redux store
  const { data: groupDetails } = useGetGroupDetailsQuery(groupId || "", {
    skip: !groupId
  });
  
  const { data: channelDetails } = useGetChannelDetailsQuery(
    { groupId: groupId || "", channelId: channelId || "" },
    { skip: !groupId || !channelId }
  );

  console.log('[StartVideoCallDialog] Channel details:', channelDetails?.data?.channelName);

  // Extract names for convenience
  const groupName = groupDetails?.name || "";
  const channelName = channelDetails?.data?.channelName || "";

  // Initialize React Hook Form
  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      meetingTitle: "",
      dateTime: new Date(),
      agenda: "",
    },
  });

  // Check if there's an active meeting in the channel
  useEffect(() => {
    if (!socket || !channelId) return;
    
    const checkActiveMeetings = () => {
      socket.emit("checkActiveMeetingsInChannel", { channelId }, (response: { active: boolean, meetingId?: string }) => {
        setIsActiveMeetingInChannel(response.active);
        setActiveMeetingId(response.meetingId || null);
      });
    };
    
    // Check when dialog opens
    if (isOpen) {
      checkActiveMeetings();
    }
    
    // Listen for meeting status updates
    socket.on("meetingStatusChanged", (data) => {
      if (data.channelId === channelId) {
        setIsActiveMeetingInChannel(data.status === "ongoing");
        setActiveMeetingId(data.status === "ongoing" ? data.meetingId : null);
      }
    });
    
    return () => {
      socket.off("meetingStatusChanged");
    };
  }, [socket, channelId, isOpen]);

  // Create a meeting
  const createMeeting = async (data?: MeetingFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!client || !user) {
        toast.error("Video client not initialized");
        return;
      }
      
      // Check if there's already an active meeting in this channel
      if (isActiveMeetingInChannel && activeMeetingId) {
        // Offer to join the existing meeting instead of creating a new one
        toast.error("A meeting is already in progress in this channel");
        setIsOpen(false);
        
        // Ask if they want to join the existing meeting
        const wantToJoin = window.confirm("A meeting is already in progress. Would you like to join it?");
        if (wantToJoin) {
          navigate(`/${groupId}/${channelId}/meeting/${activeMeetingId}`);
        }
        setIsSubmitting(false);
        return;
      }
      
      // Generate a unique meeting ID
      const id = crypto.randomUUID();
      
      // Create a call using Stream Video client
      const newCall = client.call("default", id);
      if (!newCall) {
        throw new Error("Failed to create meeting");
      }
      
      // Set up call parameters
      const startsAt = data ? data.dateTime.toISOString() : new Date().toISOString();
      const description = data ? data.meetingTitle : "Instant Meeting";
      const agenda = data?.agenda || "";
      
      // Store member information in custom data instead of trying to add them directly
      // This avoids the error with non-existent users in Stream
      const memberIds = groupDetails?.members ? 
        groupDetails.members.map(member => member._id) : [];
      
      // Create the call on Stream's servers
       await newCall.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
            agenda,
            groupId,
            channelId,
            groupName,
            channelName,
            memberIds, // Store member IDs in custom data
            createdBy: user._id
          },
          settings_override: {
            limits: {
              max_duration_seconds: MAX_MEETING_DURATION_SECONDS, // Use global config
            },
          },
        },
      });
      
      // Register the meeting with our MeetingService for duration tracking
      // This ensures meetings will end after their max duration even if all users leave
      const startTime = new Date(startsAt);
      
      // Import MeetingService dynamically to avoid circular dependencies
      import('@/lib/MeetingService').then((module) => {
        const MeetingService = module.default;
        
        // Register this meeting with the service
        MeetingService.trackMeeting(
          id,
          startTime,
          MAX_MEETING_DURATION_SECONDS, // Use global config
          socket,
          () => {
            // When meeting is ended due to timeout, update status
            if (socket && channelId) {
              socket.emit("updateMeetingStatus", {
                meetingId: id,
                status: "ended",
                endTime: new Date().toISOString(),
                reason: "max_duration_reached"
              });
              
              // Clear active meeting status in the channel
              socket.emit("setActiveMeetingInChannel", {
                channelId,
                meetingId: id,
                active: false
              });
            }
          }
        );
      });
      
      // Generate meeting link
      const meetingLink = `${window.location.origin}/${groupId}/${channelId}/meeting/${id}`;
      
      // Send message to the channel with meeting info
      if (socket && channelId) {
        const meetingType = data ? "scheduled" : "instant";
        
        socket.emit("message", {
          content: `${user.username} created a ${meetingType} meeting in ${groupName} / ${channelName}: ${description}`,
          channelId,
          attachment: {
            fileType: "application/meeting",
            fileName: description,
            type: "meeting",
            url: meetingLink.replace(window.location.origin, ''), // Store relative URL in the attachment
            size: 0,
            meetingData: {
              meetingId: id,
              title: description,
              startTime: startsAt,
              status: "scheduled",
              participantsCount: groupDetails?.members?.length || 0,
              groupName,
              channelName,
              memberIds // Include member IDs in the message data
            }
          }
        });
        
        socket.emit('create_notification', {
          type: 'meeting_created',
          groupId,
          channelId,
          senderId: user._id,
          content: `${user.username} created a ${meetingType} meeting in ${groupName} / ${channelName}: ${description}`,
        });

        // Mark this meeting as active in the channel
        socket.emit("setActiveMeetingInChannel", {
          channelId,
          meetingId: id,
          active: true
        });
      }
      
      // Close the dialog
      setIsOpen(false);
      
      // Show success message
      toast.success(data ? "Your meeting has been scheduled." : "Your instant meeting is ready.");
      
      // Navigate based on meeting type
      if (data) {
        // For scheduled meetings, navigate to scheduled meetings page
        navigate("/scheduled-meetings");
      } else {
        // For instant meetings, navigate to the meeting page
        navigate(meetingLink.replace(window.location.origin, '')); // Use meetingLink for navigation
      }
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast.error("Failed to create meeting");
    } finally {
      setIsSubmitting(false);
      setMeetingType(undefined);
    }
  };

  // Handle form submission for scheduled meetings
  const onSubmit: SubmitHandler<MeetingFormValues> = async (data) => {
    setMeetingType("isScheduleMeeting");
    await createMeeting(data);
  };

  // Handle starting an instant meeting
  const handleStartInstantMeeting = async () => {
    setMeetingType("isInstantMeeting");
    await createMeeting();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          className={`p-2 rounded-full transition-all duration-200 ${
            isOpen 
              ? 'bg-primary-500/20 text-primary-500' 
              : theme === 'dark'
                ? 'hover:bg-dark-4'
                : 'hover:bg-light-bg-2'
          }`}
          onClick={() => setIsOpen(true)}
          title="Start Video Call"
        >
          <FiVideo size={18} className={theme === 'dark' ? 'text-light-3' : 'text-light-text-3'} />
        </button>
      </DialogTrigger>

      <DialogContent className={`sm:max-w-lg w-full p-6 rounded-lg shadow-lg border-none ${
        theme === 'dark'
          ? 'bg-dark-4 text-light-1'
          : 'bg-light-bg-2 text-light-text-1'
      }`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create a Meeting
          </DialogTitle>
          <DialogDescription className={`text-sm ${
            theme === 'dark' ? 'text-light-4' : 'text-light-text-3'
          }`}>
            Schedule a new video meeting or start one now.
          </DialogDescription>
        </DialogHeader>

        {isActiveMeetingInChannel && (
          <div className="mb-4 p-3 bg-amber-900/30 border border-amber-700/50 rounded-lg">
            <p className="text-amber-300 text-sm">
              A meeting is already active in this channel. You can join it instead of creating a new one.
            </p>
            <Button
              type="button"
              className="w-full mt-2 bg-amber-600 hover:bg-amber-700 text-light-1 rounded-xl shadow-md"
              onClick={() => {
                setIsOpen(false);
                if (activeMeetingId) {
                  navigate(`/${groupId}/${channelId}/meeting/${activeMeetingId}`);
                }
              }}
            >
              Join Active Meeting
            </Button>
          </div>
        )}

        {/* Instant Meeting Button */}
        <div className="mb-4 mt-2">
          <Button
            type="button"
            className="w-full bg-primary-600 hover:bg-primary-700 text-light-1 rounded-xl shadow-md"
            onClick={handleStartInstantMeeting}
            disabled={isSubmitting || isActiveMeetingInChannel}
          >
            {isSubmitting && meetingType === "isInstantMeeting" 
              ? "Creating..." 
              : isActiveMeetingInChannel
                ? "Meeting Already In Progress"
                : "Start Instant Meeting"}
          </Button>
        </div>
        
        <div className="relative flex items-center py-2">
          <div className={`flex-grow border-t ${
            theme === 'dark' ? 'border-dark-5' : 'border-light-bg-3'
          }`}></div>
          <span className={`flex-shrink mx-4 ${
            theme === 'dark' ? 'text-light-3' : 'text-light-text-3'
          }`}>or schedule for later</span>
          <div className={`flex-grow border-t ${
            theme === 'dark' ? 'border-dark-5' : 'border-light-bg-3'
          }`}></div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            {/* Meeting Title Field */}
            <FormField
              control={form.control}
              name="meetingTitle"
              render={({ field }) => (
                <FormItem className="rounded-lg">
                  <FormLabel className={theme === 'dark' ? 'text-light-1' : 'text-light-text-1'}>
                    Meeting Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter meeting title"
                      className={`mt-1 block w-full rounded-xl ${
                        theme === 'dark'
                          ? 'bg-dark-3 border-dark-5 text-light-1 placeholder-light-3'
                          : 'bg-light-bg-1 border-light-bg-3 text-light-text-1 placeholder-light-text-3'
                      } focus:ring-primary-500 focus:border-primary-500`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time Field */}
            <FormField
              control={form.control}
              name="dateTime"
              render={({ field }) => (
                <FormItem className="rounded-lg">
                  <FormLabel className={theme === 'dark' ? 'text-light-1' : 'text-light-text-1'}>
                    Date and Time
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        dateFormat="dd/MM/yyyy hh:mm aa"
                        className={cn(
                          `mt-1 block w-full rounded-xl p-2 pl-10 ${
                            theme === 'dark'
                              ? 'bg-dark-3 border-dark-5 text-light-1 placeholder-light-3'
                              : 'bg-light-bg-1 border-light-bg-3 text-light-text-1 placeholder-light-text-3'
                          } focus:ring-primary-500 focus:border-primary-500`,
                          form.formState.errors.dateTime &&
                            "border-red-500 focus:ring-red-500"
                        )}
                      />
                      <FiCalendar
                        size={20}
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          theme === 'dark' ? 'text-light-3' : 'text-light-text-3'
                        }`}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Agenda Field */}
            <FormField
              control={form.control}
              name="agenda"
              render={({ field }) => (
                <FormItem className="rounded-lg">
                  <FormLabel className={theme === 'dark' ? 'text-light-1' : 'text-light-text-1'}>
                    Agenda
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter meeting agenda"
                      className={`mt-1 block w-full rounded-xl ${
                        theme === 'dark'
                          ? 'bg-dark-3 border-dark-5 text-light-1 placeholder-light-3'
                          : 'bg-light-bg-1 border-light-bg-3 text-light-text-1 placeholder-light-text-3'
                      } focus:ring-primary-500 focus:border-primary-500`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dialog Footer with Buttons */}
            <DialogFooter className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className={`rounded-full ${
                  theme === 'dark'
                    ? 'border-dark-5 text-light-1 hover:bg-dark-5'
                    : 'border-light-bg-3 text-light-text-1 hover:bg-light-bg-3'
                }`}
                disabled={isSubmitting}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-light-1 rounded-full shadow-md"
                disabled={isSubmitting || isActiveMeetingInChannel}
              >
                {isSubmitting && meetingType === "isScheduleMeeting" ? "Creating..." : "Schedule Meeting"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StartVideoCallDialog;
