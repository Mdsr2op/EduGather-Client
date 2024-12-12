// SignUpForm.tsx
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpValidationSchema } from "../validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "./FileUpload";
import { FiUser, FiImage } from "react-icons/fi";

interface SignUpFormValues {
  username: string;
  email: string;
  fullname: string;
  avatar: File | null;
  coverImage: File | null;
  password: string;
}

export function SignUpForm() {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpValidationSchema),
    defaultValues: {
      username: "",
      email: "",
      fullname: "",
      avatar: null,
      coverImage: null,
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignUpFormValues> = (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("fullname", data.fullname);
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    if (data.coverImage) {
      formData.append("coverImage", data.coverImage);
    }
    formData.append("password", data.password);

    // For demonstration: log FormData entries
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  };

  return (
    <section className="flex flex-1 justify-center items-center flex-col py-6 pb-0 px-4 overflow-hidden">
      <Form {...form}>
        <div className="w-full max-w-4xl">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold pt-5 sm:pt-12">
              Create a New Account
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-2">
              To use the app, enter your details below.
            </p>
          </div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Left Column: Username to Password */}
            <div className="flex flex-col gap-6">
              {/* Username Field */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="e.g., johndoe"
                        autoComplete="off"
                        className="shad-input w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="e.g., johndoe123@example.com"
                        autoComplete="off"
                        className="shad-input w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Full Name Field */}
              <FormField
                name="fullname"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="e.g., John Doe"
                        autoComplete="off"
                        className="shad-input w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="off"
                        className="shad-input w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column: Avatar and Cover Image Uploads */}
            <div className="flex flex-col gap-6">
              {/* Avatar Upload Field */}
              <FormField
                name="avatar"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Avatar (Upload)</FormLabel>
                    <FormControl>
                      <FileUpload
                        onFileUpload={(file) => form.setValue("avatar", file)}
                        label="Profile Picture"
                        accept="image/*"
                        icon={<FiUser size={24} className="text-gray-500" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cover Image Upload Field */}
              <FormField
                name="coverImage"
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Cover Image (Upload)</FormLabel>
                    <FormControl>
                      <FileUpload
                        onFileUpload={(file) => form.setValue("coverImage", file)}
                        label="Cover Photo"
                        accept="image/*"
                        icon={<FiImage size={24} className="text-gray-500" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2">
              <Button
                type="submit"
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md shad-button_primary"
              >
                Submit
              </Button>
            </div>

            {/* Sign In Link */}
            <p className="col-span-1 md:col-span-2 text-sm text-gray-600 text-center mt-4">
              Already have an account?
              <a href="/sign-in" className="text-primary-500 font-semibold ml-1">
                Sign in
              </a>
            </p>
          </form>
        </div>
      </Form>
    </section>
  );
}
