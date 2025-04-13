import React, { useState, useEffect } from "react";
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
import { useForm, SubmitHandler } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { useUpdateGroupMutation } from "../slices/groupApiSlice";
import { UserJoinedGroups } from "../slices/groupSlice";
import FileUpload from "@/features/auth/components/FileUpload";

// Reuse the same schema as CreateGroup, but for editing:
const editGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  isJoinableExternally: z.boolean().optional(),
  avatar: z.any().optional(), // new file if user wants to upload
  category: z.array(z.string()).optional(), // Array of category tags
});

type EditGroupFormValues = z.infer<typeof editGroupSchema>;

interface EditGroupDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  group: UserJoinedGroups; // The group we want to edit
}

const EditGroupDialog: React.FC<EditGroupDialogProps> = ({
  isOpen,
  setIsOpen,
  group,
}) => {
  console.log(group);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateGroup] = useUpdateGroupMutation();

  const form = useForm<EditGroupFormValues>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: {
      name: group?.name || "",
      description: group?.description || "",
      isJoinableExternally: group?.isJoinableExternally ?? true,
      avatar: null,
      category: group?.category || [],
    },
  });

  // If the group changes (for some reason), re-init form
  useEffect(() => {
    form.reset({
      name: group?.name || "",
      description: group?.description || "",
      isJoinableExternally: group?.isJoinableExternally ?? true,
      avatar: null,
      category: group?.category || [],
    });
  }, [group._id]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      form.reset();
    }
  };

  const onSubmit: SubmitHandler<EditGroupFormValues> = async (data) => {
    setIsSubmitting(true);
    console.log(data);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append(
        "isJoinableExternally",
        String(data.isJoinableExternally ?? true)
      );

      // Append files only if user selected a new file
      if (data.avatar && data.avatar.length > 0) {
        formData.append("avatar", data.avatar[0]);
      }
      
      // Append category tags if available
      if (data.category && data.category.length > 0) {
        data.category.forEach(tag => {
          formData.append("category", tag);
        });
      }

      console.log(formData.get("name"));
      console.log(formData.get("description"));
      console.log(formData.get("isJoinableExternally"));
      console.log(typeof formData.get("isJoinableExternally"));
      console.log(formData.get("avatar"));
      await updateGroup({ groupId: group._id, formData }).unwrap();

      setIsOpen(false);
    } catch (err) {
      console.error("Error updating group: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-lg w-full p-6 bg-dark-4 text-light-1 rounded-lg shadow-lg border-none overflow-y-auto max-h-[80vh] custom-scrollbar"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit Group
          </DialogTitle>
          <DialogDescription className="text-sm text-light-4">
            Update group information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel className="text-light-1">Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Group description"
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1
                                 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 
                                 rounded-xl p-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Allow External Joins */}
            <FormField
              control={form.control}
              name="isJoinableExternally"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3">
                  <FormLabel className="text-light-1 pt-2 cursor-pointer">
                    Allow External Joins
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

            {/* Avatar */}
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-1">Change Avatar</FormLabel>
                  <FormControl>
                    <FileUpload
                      label="Avatar"
                      onFileUpload={(file: File) => field.onChange([file])}
                      preview={group?.avatar || null}
                      accept={{ "image/*": [] }}
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
                <FormItem>
                  <FormLabel className="text-light-1">Categories (comma separated)</FormLabel>
                  <FormControl>
                    <Input
                     {...field}
                      placeholder="Enter tags (e.g., programming, science, math)"
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 
                                 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 
                                 rounded-xl"
                      value={field.value?.join(', ') || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Split by comma and trim each value
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
                className="bg-primary-500 hover:bg-primary-600 text-light-1 rounded-full shadow-md"
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

export default EditGroupDialog;
