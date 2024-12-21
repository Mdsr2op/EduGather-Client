"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FiPlus, FiCalendar } from "react-icons/fi";
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
import DatePicker from "react-datepicker"; // Ensure you have react-datepicker installed
import "react-datepicker/dist/react-datepicker.css";

// Define the validation schema using Zod
const meetingSchema = z.object({
  meetingTitle: z.string().min(1, "Meeting title is required").max(100, "Meeting title is too long"),
  dateTime: z
    .date({
      required_error: "Date and time are required",
      invalid_type_error: "Invalid date format",
    }),
  agenda: z.string().max(500, "Agenda is too long").optional(),
});

// Type for the form data
type MeetingFormValues = z.infer<typeof meetingSchema>;

const StartVideoCallDialog: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize React Hook Form
  const form = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      meetingTitle: "",
      dateTime: new Date(), // Default to current date and time
      agenda: "",
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<MeetingFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // Format the date and time as "DD/MM/YYYY hh:mm am/pm"
      const formattedDate = data.dateTime.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const submissionData = {
        ...data,
        dateTime: formattedDate,
      };

      console.log("Creating meeting with data:", submissionData); // Simulated API call
      form.reset();
    } catch (error) {
      console.error("Error creating meeting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-light-1 rounded-xl p-2 shadow-md"
        >
          <FiPlus size={20} className="text-light-1 mr-2" />
          Start Video Call
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create a Meeting
          </DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            Schedule a new video meeting by providing the necessary details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
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
                        showTimeSelect
                        dateFormat="dd/MM/yyyy hh:mm aa"
                        className={cn(
                          "mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl p-2 pl-10",
                          form.formState.errors.dateTime && "border-red-500 focus:ring-red-500"
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
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-dark-5 text-light-1 hover:bg-dark-5 rounded-full"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-light-1 rounded-full shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Meeting"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default StartVideoCallDialog;
