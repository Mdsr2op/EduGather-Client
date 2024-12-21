"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FaPlus } from "react-icons/fa";

// Define the validation schema using Zod
const groupSchema = z.object({
  groupName: z
    .string()
    .min(1, "Group name is required")
    .max(100, "Group name is too long"),
  groupImageUrl: z
    .string()
    .url("Invalid URL format")
    .optional()
    .or(z.literal("")),
});

// Type for the form data
type GroupFormValues = z.infer<typeof groupSchema>;

const CreateGroupDialog: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize React Hook Form
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      groupName: "",
      groupImageUrl: "",
    },
  });

  // Handle form submission
  const onSubmit: SubmitHandler<GroupFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      // Your create-group logic here.
      console.log("Creating group with data:", data); // Simulated API call
      form.reset();
      // Optionally, close the dialog after creation if desired.
    } catch (error) {
      console.error("Error creating group:", error);
      // Optionally, handle error feedback to the user.
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="mt-2 mb-2 cursor-pointer rounded-xl text-primary-500 bg-dark-3 p-3 hover:bg-dark-4 hover:shadow-lg transition duration-200 ease-in-out">
          <FaPlus size={20} />
        </div>
      </DialogTrigger>

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
            {/* Group Name Field */}
            <FormField
              control={form.control}
              name="groupName"
              render={({ field }) => (
                <FormItem className="rounded-lg">
                  <FormLabel className="text-light-1">Group Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter group name"
                      className="mt-1 block w-full bg-dark-3 border border-dark-5 text-light-1 placeholder-light-3 focus:ring-primary-500 focus:border-primary-500 rounded-xl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Group Image URL Field */}
            <FormField
              control={form.control}
              name="groupImageUrl"
              render={({ field }) => (
                <FormItem className="rounded-lg">
                  <FormLabel className="text-light-1">
                    Group Image URL (optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter image URL"
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
