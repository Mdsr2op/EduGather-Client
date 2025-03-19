import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateChannelMutation } from "@/features/root/channels/slices/channelApiSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const createChannelSchema = z.object({
  channelName: z.string().min(1, "Channel name is required").max(100),
  description: z.string().optional(),
});

type CreateChannelFormValues = z.infer<typeof createChannelSchema>;

type CreateChannelDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  groupId: string | null;
};

const CreateChannelDialog: React.FC<CreateChannelDialogProps> = ({
  isOpen,
  setIsOpen,
  groupId,
}) => {
  const [createChannel, { isLoading, isError, error }] = useCreateChannelMutation();

  const form = useForm<CreateChannelFormValues>({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      channelName: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateChannelFormValues) => {
    try {
      await createChannel({
        groupId,
        channelName: data.channelName,
        description: data.description,
      }).unwrap();
      form.reset();
      setIsOpen(false);
    } catch (err) {
      console.error("Channel creation failed", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none overflow-y-auto max-h-[80vh] custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Create a Channel</DialogTitle>
          <DialogDescription className="text-sm text-light-4">Fill in the details to create a new channel.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
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
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-1">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter channel description"
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isError && (
              <div className="mt-2 text-red-500">
                {(error as any)?.data?.message || "Failed to create channel. Please try again."}
              </div>
            )}

            <DialogFooter className="flex justify-end space-x-2 pt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-dark-5 text-light-1 hover:bg-dark-5 rounded-full"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-light-1 rounded-full shadow-md"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Channel"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelDialog;
