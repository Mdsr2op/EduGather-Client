"use client";

import React, { useState } from "react";
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
  DialogClose,
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
import { useToast } from "@/hooks/use-toast";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/slices/authSlice";
import { useSocket } from "@/lib/socket";

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
  const [meetingId, setMeetingId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const { toast } = useToast();
  const client = useStreamVideoClient();
  const user = useSelector(selectCurrentUser);
  const { groupId, channelId } = useParams();
  const { socket } = useSocket();

  // Initialize React Hook Form
  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      meetingTitle: "",
      dateTime: new Date(),
      agenda: "",
    },
  });

  // Create a meeting
  const createMeeting = async (data?: MeetingFormValues) => {
    try {
      setIsSubmitting(true);
      
      if (!client || !user) {
        toast({
          title: "Error",
          description: "Video client not initialized",
          variant: "destructive",
        });
        return;
      }
      
      // Generate a unique meeting ID
      const id = crypto.randomUUID();
      setMeetingId(id);
      
      // Create a call using Stream Video client
      const call = client.call("default", id);
      if (!call) {
        throw new Error("Failed to create meeting");
      }
      
      // Set up call parameters
      const startsAt = data ? data.dateTime.toISOString() : new Date().toISOString();
      const description = data ? data.meetingTitle : "Instant Meeting";
      const agenda = data?.agenda || "";
      
      // Create the call on Stream's servers
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
            agenda,
          },
        },
      });
      
      // Send message to the channel with meeting info
      if (socket && channelId) {
        const meetingType = data ? "scheduled" : "instant";
        const meetingStatus = "scheduled";
        
        socket.emit("message", {
          content: `${user.username} created a ${meetingType} meeting: ${description}`,
          channelId,
          attachment: {
            fileType: "application/meeting",
            fileName: description,
            type: "meeting",
            url: `/${groupId}/${channelId}/meeting/${id}`,
            size: 0,
            meetingData: {
              meetingId: id,
              title: description,
              startTime: startsAt,
              status: "scheduled",
              participantsCount: 0
            }
          }
        });
      }
      
      // Close the dialog
      setIsOpen(false);
      
      // Show success message
      toast({
        title: "Meeting Created",
        description: data ? "Your meeting has been scheduled." : "Your instant meeting is ready.",
      });
      
      // Navigate to meeting route with groupId and channelId
      navigate(`/${groupId}/${channelId}/meeting/${id}`);
      
      // Reset form
      form.reset();
      
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast({
        title: "Failed to create meeting",
        variant: "destructive",
      });
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

  // Generate meeting link if a meeting ID exists
  const meetingLink = meetingId 
    ? `${window.location.origin}/${groupId}/${channelId}/meeting/${meetingId}`
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center justify-center text-light-1 rounded-xl shadow-md"
          onClick={() => setIsOpen(true)}
        >
          <FiVideo size={20} className="text-primary-500 mr-2" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create a Meeting
          </DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            Schedule a new video meeting or start one now.
          </DialogDescription>
        </DialogHeader>

        {/* Instant Meeting Button */}
        <div className="mb-4 mt-2">
          <Button
            type="button"
            className="w-full bg-primary-500 hover:bg-primary-600 text-light-1 rounded-xl shadow-md"
            onClick={handleStartInstantMeeting}
            disabled={isSubmitting}
          >
            {isSubmitting && meetingType === "isInstantMeeting" 
              ? "Creating..." 
              : "Start Instant Meeting"}
          </Button>
        </div>
        
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-dark-5"></div>
          <span className="flex-shrink mx-4 text-light-3">or schedule for later</span>
          <div className="flex-grow border-t border-dark-5"></div>
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
                  <FormLabel className="text-light-1">Meeting Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter meeting title"
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
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
                  <FormLabel className="text-light-1">Date and Time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DatePicker
                        selected={field.value}
                        onChange={field.onChange}
                        showTimeSelect
                        dateFormat="dd/MM/yyyy hh:mm aa"
                        className={cn(
                          "mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl p-2 pl-10",
                          form.formState.errors.dateTime &&
                            "border-red-500 focus:ring-red-500"
                        )}
                      />
                      <FiCalendar
                        size={20}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-3"
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
                  <FormLabel className="text-light-1">Agenda</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter meeting agenda"
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
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
                className="border-dark-5 text-light-1 hover:bg-dark-5 rounded-full"
                disabled={isSubmitting}
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-light-1 rounded-full shadow-md"
                disabled={isSubmitting}
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
