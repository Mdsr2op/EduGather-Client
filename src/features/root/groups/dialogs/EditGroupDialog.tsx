import React, { useState, useEffect, useRef } from "react";
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
import { toast } from "react-hot-toast";
import { useTheme } from "@/context/ThemeContext";

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
  focusField?: 'name' | 'description' | 'avatar' | 'categories'; // Optional field to focus on
}

const EditGroupDialog: React.FC<EditGroupDialogProps> = ({
  isOpen,
  setIsOpen,
  group,
  focusField,
}) => {
  const { theme } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateGroup] = useUpdateGroupMutation();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const avatarInputRef = useRef<HTMLDivElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);

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

  // Set focus on the specified field when dialog opens
  useEffect(() => {
    if (isOpen && focusField) {
      setTimeout(() => {
        switch (focusField) {
          case 'name':
            nameInputRef.current?.focus();
            break;
          case 'description':
            descriptionInputRef.current?.focus();
            break;
          case 'avatar':
            avatarInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            break;
          case 'categories':
            categoryInputRef.current?.focus();
            break;
        }
      }, 100);
    }
  }, [isOpen, focusField]);

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

      toast.success("Group updated successfully!", {
        position: "top-right"
      });
      setIsOpen(false);
    } catch (err) {
      console.error("Error updating group: ", err);
      toast.error("Failed to update group. Please try again.", {
        position: "top-right"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`sm:max-w-3xl w-full p-6 rounded-lg shadow-lg border-none overflow-y-auto max-h-[80vh] custom-scrollbar ${
          theme === 'dark'
            ? 'bg-dark-3 text-light-1'
            : 'bg-light-bg-2 text-light-text-1'
        }`}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Edit Group
          </DialogTitle>
          <DialogDescription className={`text-sm ${
            theme === 'dark' ? 'text-light-4' : 'text-light-text-3'
          }`}>
            Update group information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
            {/* Header with group name and avatar */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="relative group">
                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem className={focusField === 'avatar' ? 'ring-2 ring-primary-500 rounded-xl p-2' : ''}>
                      <FormControl>
                        <div ref={avatarInputRef}>
                          <FileUpload
                            label="Avatar"
                            onFileUpload={(file: File) => field.onChange([file])}
                            preview={group?.avatar || null}
                            accept={{ "image/*": [] }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex flex-col flex-1 items-center md:items-start text-center md:text-left">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className={`w-full ${focusField === 'name' ? 'ring-2 ring-primary-500 rounded-xl p-2' : ''}`}>
                      <FormLabel className={`text-2xl md:text-3xl font-bold ${
                        theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
                      }`}>
                        Group Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          ref={nameInputRef}
                          placeholder="Enter group name"
                          className={`mt-1 block w-full border rounded-xl text-lg ${
                            theme === 'dark'
                              ? 'bg-dark-3 border-dark-5 text-light-1 placeholder-light-3'
                              : 'bg-light-bg-1 border-light-bg-3 text-light-text-1 placeholder-light-text-3'
                          } focus:ring-primary-500 focus:border-primary-500`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description section */}
            <div className={`mb-8 p-4 rounded-xl ${
              theme === 'dark' ? 'bg-dark-2' : 'bg-light-bg-1'
            }`}>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className={focusField === 'description' ? 'ring-2 ring-primary-500 rounded-xl p-2' : ''}>
                    <FormLabel className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
                    }`}>
                      Description
                    </FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        ref={descriptionInputRef}
                        placeholder="Group description"
                        className={`mt-1 block w-full border rounded-xl p-2 min-h-[100px] ${
                          theme === 'dark'
                            ? 'bg-dark-3 border-dark-5 text-light-1 placeholder-light-3'
                            : 'bg-light-bg-1 border-light-bg-3 text-light-text-1 placeholder-light-text-3'
                        } focus:ring-primary-500 focus:border-primary-500`}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Categories section */}
            <div className={`mb-8 p-4 rounded-xl ${
              theme === 'dark' ? 'bg-dark-2' : 'bg-light-bg-1'
            }`}>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className={focusField === 'categories' ? 'ring-2 ring-primary-500 rounded-xl p-2' : ''}>
                    <FormLabel className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
                    }`}>
                      Categories
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        ref={categoryInputRef}
                        placeholder="Enter tags (e.g., programming, science, math)"
                        className={`mt-1 block w-full border rounded-xl ${
                          theme === 'dark'
                            ? 'bg-dark-3 border-dark-5 text-light-1 placeholder-light-3'
                            : 'bg-light-bg-1 border-light-bg-3 text-light-text-1 placeholder-light-text-3'
                        } focus:ring-primary-500 focus:border-primary-500`}
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
            </div>

            {/* Privacy settings */}
            <div className={`mb-8 p-4 rounded-xl ${
              theme === 'dark' ? 'bg-dark-2' : 'bg-light-bg-1'
            }`}>
              <FormField
                control={form.control}
                name="isJoinableExternally"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between">
                    <div>
                      <FormLabel className={`text-lg font-semibold ${
                        theme === 'dark' ? 'text-light-1' : 'text-light-text-1'
                      }`}>
                        Privacy Settings
                      </FormLabel>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-light-3' : 'text-light-text-3'
                      }`}>
                        Allow external users to join this group
                      </p>
                    </div>
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
            </div>

            {/* Footer */}
            <DialogFooter className="flex justify-end space-x-2 pt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className={`rounded-full ${
                    theme === 'dark'
                      ? 'border-dark-5 text-light-1 hover:bg-dark-5'
                      : 'border-light-bg-3 text-light-text-1 hover:bg-light-bg-1'
                  }`}
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
