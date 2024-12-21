import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
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
import { channelSchema } from "@/features/auth/validations/ChannelValidationSchema";

// Type for the form data
type ChannelFormValues = z.infer<typeof channelSchema>;

const AddChannelDialog: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize React Hook Form
  const form = useForm<ChannelFormValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      channelName: "",
      channelDescription: "",
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<ChannelFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting channel data:", data); // Simulated API call
      form.reset();
    } catch (error) {
      console.error("Error adding channel:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex items-center justify-center w-full bg-primary-500 hover:bg-primary-600 text-light-1 rounded-xl mt-2 shadow-md"
        >
          <FiPlus size={20} className="text-light-1 mr-2" />
          Add Channel
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add a New Channel
          </DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            Please provide a name and description for the new channel.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="channelName"
              render={({ field }) => (
                <FormItem className="rounded-lg">
                  <FormLabel className="text-light-1">Channel Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter channel name"
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="channelDescription"
              render={({ field }) => (
                <FormItem className="rounded-lg">
                  <FormLabel className="text-light-1">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter channel description"
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isSubmitting ? "Adding..." : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChannelDialog;
