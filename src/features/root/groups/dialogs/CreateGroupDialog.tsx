"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateGroupMutation, groupsApi } from "../slices/groupApiSlice";
import { useDispatch } from "react-redux";
import FileUpload from "@/features/auth/components/FileUpload";
import { toast } from "react-hot-toast";
// Zod schema consistent with your group.model.js and createGroup controller
const groupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  isJoinableExternally: z.boolean().optional(), // default = true
  avatar: z.any().optional(), // We'll handle as file
  category: z.array(z.string()).optional(), // Array of category tags
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
  const dispatch = useDispatch();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
      isJoinableExternally: true,
      avatar: null,
      category: [],
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
    // Append category tags if available
    if (data.category && data.category.length > 0) {
      data.category.forEach(tag => {
        formData.append("category", tag);
      });
    }

    try {
      const createdGroup = await createGroup(formData).unwrap();
      console.log("Group created successfully:", createdGroup);
      
      // Check if we got a valid response with group data
      if (!createdGroup || !createdGroup._id) {
        console.warn("API returned success but with incomplete group data");
        toast.success("Group created successfully", {
          position: "top-center"
        });
      } else {
        // Check if avatar was correctly set
        if (data.avatar && data.avatar.length > 0 && !createdGroup.avatar) {
          console.warn("Avatar was uploaded but not set in the response");
        }
        
        // Show success toast with fallback for undefined name
        toast.success(`Group "${createdGroup.name || data.name}" created successfully`, {
          position: "top-center"
        });
      }
      
      // Manually refetch groups data
      dispatch(groupsApi.util.invalidateTags([
        { type: "Groups", id: "LIST" },
        { type: "Groups", id: "CATEGORIES" },
        // If the group has categories, invalidate those specific category caches as well
        ...(data.category?.map(cat => ({ type: "Groups" as const, id: `category-${cat}` })) || [])
      ]));
      
      // If successful, close the dialog and reset form
      form.reset();
      if (onClose) onClose();
    } catch (error: any) {
      console.error("Error creating group:", error);
      toast.error(error?.data?.message || "Failed to create group. Please try again.", {
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
      <DialogContent className="sm:max-w-lg w-full p-6 bg-white dark:bg-dark-4 text-gray-900 dark:text-light-1 rounded-lg shadow-lg border-none overflow-y-auto custom-scrollbar max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create a New Group
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 dark:text-light-4">
            Set up a new group by providing the necessary details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            {/* Group Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="rounded-lg">
                  <FormLabel className="text-gray-900 dark:text-light-1">Group Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter group name"
                      className="mt-1 block w-full bg-gray-50 dark:bg-dark-3 border border-gray-200 dark:border-dark-5 
                               text-gray-900 dark:text-light-1 placeholder-gray-400 dark:placeholder-light-3 
                               focus:ring-primary-500 focus:border-primary-500 rounded-xl"
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
                  <FormLabel className="text-gray-900 dark:text-light-1">Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Enter group description"
                      className="mt-1 block w-full bg-gray-50 dark:bg-dark-3 border border-gray-200 dark:border-dark-5 
                               text-gray-900 dark:text-light-1 placeholder-gray-400 dark:placeholder-light-3 
                               focus:ring-primary-500 focus:border-primary-500 rounded-xl p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Tags */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="rounded-lg">
                  <FormLabel className="text-gray-900 dark:text-light-1">Categories (comma separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter tags (e.g., programming, science, math)"
                      className="mt-1 block w-full bg-gray-50 dark:bg-dark-3 border border-gray-200 dark:border-dark-5 
                               text-gray-900 dark:text-light-1 placeholder-gray-400 dark:placeholder-light-3 
                               focus:ring-primary-500 focus:border-primary-500 rounded-xl"
                      value={field.value?.join(', ') || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        const tags = value
                          .split(',')
                          .map(tag => tag.trim())
                          .filter(tag => tag !== '');
                        field.onChange(tags);
                      }}
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
                <FormItem className="flex flex-row items-center space-x-3">
                  <FormLabel className="text-gray-900 dark:text-light-1 pt-2 cursor-pointer">
                    Private
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                  <FormLabel className="text-gray-900 dark:text-light-1">Avatar (optional)</FormLabel>
                  <FormControl>
                    <FileUpload
                      label="Avatar"
                      onFileUpload={(file: File) => field.onChange([file])}
                      preview={null}
                      accept={{ "image/*": [] }}
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
                  className="border-gray-200 dark:border-dark-5 text-gray-900 dark:text-light-1 
                           hover:bg-gray-100 dark:hover:bg-dark-5 rounded-full"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-md"
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
