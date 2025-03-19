// features/channels/dialogs/EditChannelDialog.tsx

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"; // or wherever your <Dialog> is located
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateChannelMutation } from "../slices/channelApiSlice";
import { Channel } from "../slices/channelSlice";

// We define a zod schema for editing a channel
const editChannelSchema = z.object({
  channelName: z.string().min(1, "Channel name is required").max(100),
  description: z.string().max(500).optional(),
});

type EditChannelFormValues = z.infer<typeof editChannelSchema>;

interface EditChannelDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  channel: Channel; // The channel to edit
}

const EditChannelDialog: React.FC<EditChannelDialogProps> = ({
  isOpen,
  setIsOpen,
  channel,
}) => {
  const [updateChannel] = useUpdateChannelMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditChannelFormValues>({
    resolver: zodResolver(editChannelSchema),
    defaultValues: {
      channelName: channel.channelName,
      description: channel.description || "",
    },
  });

  // Re-initialize form if channel changes
  useEffect(() => {
    form.reset({
      channelName: channel.channelName,
      description: channel.description || "",
    });
  }, [channel._id]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      form.reset();
    }
  };

  async function onSubmit(data: EditChannelFormValues) {
    if (!channel.groupId) return;

    setIsSubmitting(true);
    try {
      await updateChannel({
        groupId: channel.groupId,
        channelId: channel._id,
        channelName: data.channelName,
        description: data.description,
      }).unwrap();

      setIsOpen(false);
    } catch (err) {
      console.error("Error updating channel:", err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg w-full p-6 bg-dark-4 text-light-1 rounded-lg border-none overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit Channel
          </DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            Update channel information below
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            {/* Channel Name */}
            <FormField
              control={form.control}
              name="channelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-1">Channel Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter channel name"
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1
                                 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 
                                 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-1">Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Enter channel description"
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 
                                 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 
                                 rounded-xl p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Footer */}
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
                className="bg-primary-500 hover:bg-primary-600 text-light-1 rounded-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditChannelDialog;
