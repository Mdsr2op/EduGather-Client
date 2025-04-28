// SignInForm.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInValidationSchema } from "../validations";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FiLock, FiMail } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import IconInput from "@/components/ui/icon-input";
import { useSignInMutation } from "../slices/authApiSlice";
import { SignInFormValues } from "../types";


export function SignInForm() {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInValidationSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const [signIn, { isLoading }] = useSignInMutation();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignInFormValues> = async (data) => {
    try {
      await signIn(data).unwrap();
      toast.success("Signed in successfully!");
      navigate("/")
      
    } catch (err) {
      console.error("Signin failed:", err);
      toast.error("Signin failed. Please try again.");
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/v1/users/auth/google`;
  };

  return (
    <section className="flex flex-1 justify-center items-center flex-col py-6 px-4 overflow-hidden">
      <Form {...form}>
        <div className="w-full max-w-md">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold pt-5 sm:pt-12">
              Sign In
            </h2>
            <p className="text-light-3 text-sm md:text-base mt-2">
              Welcome back! Please enter your credentials to sign in.
            </p>
          </div>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full mt-10 grid grid-cols-1 gap-6"
          >
            {/* Identifier Field: Username or Email */}
            <FormField
              name="usernameOrEmail"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <IconInput
                      {...field}
                      type="text"
                      placeholder="e.g., johndoe or johndoe@example.com"
                      autoComplete="username"
                      className="shad-input w-full"
                      icon={<FiMail size={20} className="text-gray-500" />}
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
                    <IconInput
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="shad-input w-full"
                      icon={<FiLock size={20} className="text-gray-500" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md shad-button_primary"
              >
                {isLoading ? "Processing..." : "Sign In"}
              </Button>
            </div>

            {/* Google Sign In Button */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 py-2 rounded-md"
            >
              <FcGoogle size={20} />
              <span>Sign in with Google</span>
            </Button>

            {/* Additional Links */}
            <div className="flex flex-col justify-between items-center gap-6">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-500 hover:underline"
              >
                Forgot Password?
              </Link>
              <span className="text-sm text-gray-600">
                Don&apos;t have an account?
                <Link
                  to="/sign-up"
                  className="text-primary-500 font-semibold ml-1 hover:underline"
                >
                  Sign Up
                </Link>
              </span>
            </div>
          </form>
        </div>
      </Form>
    </section>
  );
}