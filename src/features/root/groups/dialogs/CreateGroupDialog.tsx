// CreateGroupDialog.tsx

"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useCreateGroupMutation } from "../slices/groupApiSlice";

// Zod schema consistent with your group.model.js and createGroup controller
const groupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  isJoinableExternally: z.boolean().optional(), // default = true
  avatar: z.any().optional(), // We'll handle as file
  coverImage: z.any().optional(), // We'll handle as file
});

type GroupFormValues = z.infer<typeof groupSchema>;

interface CreateGroupDialogProps {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  onClose?: () => void;
}

const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  isOpen = false,
  setIsOpen,
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createGroup] = useCreateGroupMutation();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
      isJoinableExternally: true,
      avatar: null,
      coverImage: null,
    },
  });

  // Handle dialog open/close
  const handleOpen = (open: boolean) => {
    if (setIsOpen) {
      setIsOpen(open);
    }
    if (!open && onClose) {
      onClose();
    }
  };

  const onSubmit: SubmitHandler<GroupFormValues> = async (data) => {
    setIsSubmitting(true);

    // Build the FormData
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append(
      "isJoinableExternally",
      String(data.isJoinableExternally ?? true)
    );
    if (data.avatar && data.avatar.length > 0) {
      formData.append("avatar", data.avatar[0]);
    }
    if (data.coverImage && data.coverImage.length > 0) {
      formData.append("coverImage", data.coverImage[0]);
    }

    try {
      await createGroup(formData).unwrap();
      // If successful, close the dialog
      form.reset();
      if (onClose) onClose();
    } catch (error) {
      console.error("Error creating group:", error);
      // Optionally show error to user
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
            Create a New Group
          </DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            Set up a new group by providing the necessary details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            {/* Group Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="rounded-lg">
                  <FormLabel className="text-light-1">Group Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter group name"
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
                <FormItem className="rounded-lg">
                  <FormLabel className="text-light-1">Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Enter group description"
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 
                                 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 
                                 rounded-xl p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* isJoinableExternally */}
            <FormField
              control={form.control}
              name="isJoinableExternally"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel className="text-light-1">Allow External Joins</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Avatar (Image) */}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem className="rounded-lg">
                  <FormLabel className="text-light-1">Avatar (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1
                                 file:bg-dark-6 file:border-0 file:text-light-2
                                 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 
                                 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Image (Image) */}
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem className="rounded-lg">
                  <FormLabel className="text-light-1">Cover Image (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => field.onChange(e.target.files)}
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1
                                 file:bg-dark-6 file:border-0 file:text-light-2
                                 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 
                                 rounded-xl"
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
                {isSubmitting ? "Creating..." : "Create Group"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupDialog;
