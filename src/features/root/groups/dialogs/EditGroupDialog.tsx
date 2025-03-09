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
import { useUpdateGroupMutation } from "../slices/groupApiSlice";
import { UserJoinedGroups } from "../slices/groupSlice";
import FileUpload from "@/features/auth/components/FileUpload";

// Reuse the same schema as CreateGroup, but for editing:
const editGroupSchema = z.object({
  name: z.string().min(1, "Group name is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  isJoinableExternally: z.boolean().optional(),
  avatar: z.any().optional(), // new file if user wants to upload
  coverImage: z.any().optional(), // new file if user wants to upload
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateGroup] = useUpdateGroupMutation();

  const form = useForm<EditGroupFormValues>({
    resolver: zodResolver(editGroupSchema),
    defaultValues: {
      name: group?.name || "",
      description: group?.description || "",
      isJoinableExternally: group?.isJoinableExternally ?? true,
      avatar: null,
      coverImage: null,
    },
  });

  // If the group changes (for some reason), re-init form
  useEffect(() => {
    form.reset({
      name: group?.name || "",
      description: group?.description || "",
      isJoinableExternally: group?.isJoinableExternally ?? true,
      avatar: null,
      coverImage: null,
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
      if (data.coverImage && data.coverImage.length > 0) {
        formData.append("coverImage", data.coverImage[0]);
      }

      console.log(formData.get("name"));
      console.log(formData.get("description"));
      console.log(formData.get("isJoinableExternally"));
      console.log(typeof formData.get("isJoinableExternally"));
      console.log(formData.get("avatar"));
      console.log(formData.get("coverImage"));
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
                <FormItem className="flex flex-row items-center space-x-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel className="text-light-1">
                    Allow External Joins
                  </FormLabel>
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

            {/* Cover Image */}
            <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-1">
                    Change Cover Image
                  </FormLabel>
                  <FormControl>
                    <FileUpload
                      label="Cover Image"
                      onFileUpload={(file: File) => field.onChange([file])}
                      preview={group?.coverImage || null}
                      accept={{ "image/*": [] }}
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
