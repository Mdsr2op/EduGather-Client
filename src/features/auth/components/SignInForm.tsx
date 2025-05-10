// SignInForm.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInValidationSchema } from "../validations";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiLock, FiMail, FiLogIn } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useSignInMutation } from "../slices/authApiSlice";
import { SignInFormValues } from "../types";


export function SignInForm() {
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(SignInValidationSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
    mode: "onChange",
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
    <Form {...form}>
      <div className="w-full max-w-3xl mx-auto bg-dark-3 rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-24 bg-gradient-to-r from-primary-500 to-primary-600 flex items-end">
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-dark-4 rounded-full p-3 shadow-md">
            <div className="h-14 w-14 rounded-full bg-primary-500 flex items-center justify-center">
              <FiLogIn className="text-light-1 text-2xl" />
            </div>
          </div>
        </div>

        <div className="pt-14 px-6 sm:px-10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-light-1">
              Welcome Back
            </h2>
            <p className="text-light-3 text-sm mt-2">
              Sign in to continue to your account
            </p>
          </motion.div>

          <div className="mt-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-3 border border-dark-5 bg-dark-4 text-light-1 hover:bg-dark-5 py-6 rounded-xl shadow-sm transition-all duration-200"
              >
                <FcGoogle size={22} />
                <span className="font-medium">Continue with Google</span>
              </Button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dark-5" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-dark-3 text-light-3">
                    Or sign in with email
                  </span>
                </div>
              </div>

              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  name="usernameOrEmail"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Username or Email"
                            autoComplete="username"
                            className="pl-10 py-6 rounded-xl bg-dark-4 border-dark-5 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 text-light-1 placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      </div>
                      <FormMessage className="text-red mt-1 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Password"
                            autoComplete="current-password"
                            className="pl-10 py-6 rounded-xl bg-dark-4 border-dark-5 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 text-light-1 placeholder:text-gray-500"
                          />
                        </FormControl>
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      </div>
                      <FormMessage className="text-red mt-1 text-sm" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-3"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing in...</span>
                    </div>
                  ) : "Sign In"}
                </Button>

                <div className="text-center mt-6">
                  <p className="text-light-3 text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/sign-up"
                      className="text-primary-500 font-medium hover:text-primary-600 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </Form>
  );
}