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
import { FiUser, FiMail, FiLock, FiUserPlus } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useSignupMutation } from "../slices/authApiSlice";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface SignUpFormValues {
  username: string;
  email: string;
  fullName: string;
  avatar: File | null;
  password: string;
}

export function SignUpForm() {
  const [step, setStep] = useState<1 | 2>(1);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpValidationSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      avatar: null,
      password: "",
    },
    mode: "onChange",
  });

  const [signup, { isLoading }] = useSignupMutation();

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data) => {
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
    window.location.href = `${
      import.meta.env.VITE_API_URL || "https://api-edugather.com"
    }/api/v1/users/auth/google`;
  };

  const nextStep = () => {
    const { username, email, password } = form.getValues();
    const isValid =
      !!username &&
      !!email &&
      !!password &&
      !form.formState.errors.username &&
      !form.formState.errors.email &&
      !form.formState.errors.password;

    if (isValid) setStep(2);
    else {
      form.trigger(["username", "email", "password"]);
      toast.error("Please complete all required fields correctly");
    }
  };

  const prevStep = () => setStep(1);

  return (
    <Form {...form}>
      <div className="w-full max-w-3xl mx-auto bg-dark-3 rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-24 bg-gradient-to-r from-primary-500 to-primary-600 flex items-end">
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-dark-4 rounded-full p-3 shadow-md">
            <div className="h-14 w-14 rounded-full bg-primary-500 flex items-center justify-center">
              <FiUserPlus className="text-light-1 text-2xl" />
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
              Join EduGather
            </h2>
            <p className="text-light-3 text-sm mt-2">
              Create your account to start collaborating
            </p>
          </motion.div>

          <div className="mt-10">
            {step === 1 ? (
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
                      Or continue with email
                    </span>
                  </div>
                </div>

                <div className="space-y-5">
                  <FormField
                    name="username"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Username"
                              autoComplete="off"
                              className="pl-10 py-6 rounded-xl bg-dark-4 border-dark-5 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 text-light-1 placeholder:text-gray-500"
                            />
                          </FormControl>
                          <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                        <FormMessage className="text-red mt-1 text-sm" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Email address"
                              autoComplete="off"
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
                              autoComplete="off"
                              className="pl-10 py-6 rounded-xl bg-dark-4 border-dark-5 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 text-light-1 placeholder:text-gray-500"
                            />
                          </FormControl>
                          <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                        <FormMessage className="text-red mt-1 text-sm" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full py-6 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-3"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <FormField
                  name="fullName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-light-2 font-medium">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="John Doe"
                          autoComplete="off"
                          className="py-6 rounded-xl bg-dark-4 border-dark-5 focus:border-primary-500 focus:ring focus:ring-primary-500/20 transition-all duration-200 text-light-1 placeholder:text-gray-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red mt-1 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="avatar"
                  control={form.control}
                  render={() => (
                    <FormItem>
                      <FormLabel className="text-light-2 font-medium">
                        Profile Picture
                      </FormLabel>
                      <FormControl>
                        <div className="mt-2">
                          <FileUpload
                            onFileUpload={(file) =>
                              form.setValue("avatar", file)
                            }
                            label="Upload Avatar"
                            accept={{
                              "image/jpeg": [".jpeg", ".jpg"],
                              "image/png": [".png"],
                              "image/gif": [".gif"],
                            }}
                            icon={
                              <FiUser size={24} className="text-primary-500" />
                            }
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red mt-1 text-sm" />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    onClick={prevStep}
                    className="w-1/3 py-6 bg-dark-4 text-light-2 font-medium rounded-xl hover:bg-dark-5 transition-all duration-200"
                  >
                    Back
                  </Button>

                  <Button
                    type="button"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isLoading}
                    className="w-2/3 py-6 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        <div className="text-center mb-4">
          <p className="text-light-3 text-sm">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-primary-500 font-medium hover:text-primary-600 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </Form>
  );
}
