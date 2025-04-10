// JoinGroupDialog.tsx
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useJoinGroupMutation } from "../slices/groupApiSlice";

const joinGroupSchema = z.object({
  groupCode: z.string().min(1, "Group code is required").max(20),
});

type JoinGroupFormValues = z.infer<typeof joinGroupSchema>;

interface JoinGroupDialogProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  onClose?: () => void;
}

const JoinGroupDialog: React.FC<JoinGroupDialogProps> = ({
  isOpen = false,
  setIsOpen,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinGroup] = useJoinGroupMutation();

  const form = useForm<JoinGroupFormValues>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: {
      groupCode: "",
    },
  });

  const handleOpen = (open: boolean) => {
    if (setIsOpen) {
      setIsOpen(open);
    }
    if (!open && onClose) {
      onClose();
    }
  };

  const onSubmit: SubmitHandler<JoinGroupFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await joinGroup({ groupId: data.groupCode }).unwrap();
      toast.success("Successfully joined the group!", {
        position: "top-center"
      });
      form.reset();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Failed to join the group. Please try again.", {
        position: "top-center"
      });
    } finally {
      setIsSubmitting(false);
      if (setIsOpen) {
        setIsOpen(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-lg w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Join a Group
          </DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            Enter the group code to join an existing group.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="groupCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-1">Group Code</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter group code"
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 
                                 text-light-1 placeholder-light-3 focus:ring-primary-500 
                                 focus:border-primary-500 rounded-xl"
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
                {isSubmitting ? "Joining..." : "Join Group"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinGroupDialog;
