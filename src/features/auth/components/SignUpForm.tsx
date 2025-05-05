// SignUpForm.tsx
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
import { FiUser } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useSignupMutation } from "../slices/authApiSlice";
import { toast } from "react-hot-toast";

interface SignUpFormValues {
  username: string;
  email: string;
  fullName: string;
  avatar: File | null;
  password: string;
}

export function SignUpForm() {
 
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpValidationSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      avatar: null,
      password: "",
    },
  });

  const [signup, { isLoading }] = useSignupMutation();

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
     console.log("clicked")
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("fullName", data.fullName);
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }
    formData.append("password", data.password);

    try {
      await signup(formData).unwrap();
      toast.success("Account created successfully!");
    } catch (err) {
      console.error("Signup failed:", err);
      toast.error("Signup failed. Please try again.");
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/users/auth/google`;
  };

  return (
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

        {/* Google Sign Up Button */}
        <div className="w-full max-w-md mx-auto mt-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Quick signup with</span>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 py-2 rounded-md"
          >
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </Button>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
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
                  <FormMessage className="shad-form_message" />
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
                  <FormMessage className="shad-form_message"/>
                </FormItem>
              )}
            />

            {/* Full Name Field */}
            <FormField
              name="fullName"
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
                  <FormMessage className="shad-form_message" />
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
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column: Avatar Upload */}
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
                      accept={{
                        'image/jpeg': ['.jpeg', '.jpg'],
                        'image/png': ['.png'],
                        'image/gif': ['.gif'],
                      }}
                      icon={<FiUser size={24} className="text-gray-500" />}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message"/>
                </FormItem>
              )}
            />
            
            {/* Submit Button */}
            <Button 
              type="submit"
              className="shad-button_primary mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
}
