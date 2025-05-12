import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleProfileSetupSchema } from "../validations";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useUpdateProfileMutation } from "../slices/authApiSlice";
import { useAppSelector } from "@/redux/hook";
import { selectCurrentUser } from "../slices/authSlice";
import { useState } from "react";
import { ProfileSetupSuccess } from "./ProfileSetupSuccess";

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

interface GoogleProfileSetupValues {
  username: string;
  avatar: File | null;
}

export function GoogleProfileSetup() {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [setupComplete, setSetupComplete] = useState(false);

  // Redirect if the user already has a username
  if (user && user.username && user.username.length > 0 && user.username !== user.email) {
    navigate("/home");
    return null;
  }

  const form = useForm<GoogleProfileSetupValues>({
    resolver: zodResolver(GoogleProfileSetupSchema),
    defaultValues: {
      username: "",
      avatar: null,
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<GoogleProfileSetupValues> = async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    
    if (data.avatar) {
      formData.append("avatar", data.avatar);
    }

    try {
      await updateProfile(formData).unwrap();
      setSetupComplete(true);
    } catch (err) {
      console.error("Profile setup failed:", err);
      toast.error("Profile setup failed. Please try again.");
    }
  };

  if (setupComplete) {
    return <ProfileSetupSuccess />;
  }

  return (
    <Form {...form}>
      <div className="w-[440px] bg-dark-2 rounded-xl shadow-xl overflow-hidden">
        <div className="relative h-24 bg-gradient-to-r from-primary-500 to-primary-600 flex items-end">
          <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-dark-3 rounded-full p-3 shadow-md">
            <div className="h-14 w-14 rounded-full bg-primary-500 flex items-center justify-center">
              <FiUser className="text-light-1 text-2xl" />
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
              Complete Your Profile
            </h2>
            <p className="text-light-3 text-sm mt-2">
              Set up your username and profile picture to continue
            </p>
          </motion.div>

          <div className="mt-8 space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-light-2 font-medium">
                    Username
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Choose a unique username"
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
              name="avatar"
              control={form.control}
              render={() => (
                <FormItem>
                  <FormLabel className="text-light-2 font-medium">
                    Profile Picture (Optional)
                  </FormLabel>
                  <FormControl>
                    <div className="mt-2">
                      <FileUpload
                        onFileUpload={(file) => form.setValue("avatar", file)}
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

            <Button
              type="button"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="w-full py-6 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 mt-6"
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
                  <span>Saving...</span>
                </div>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
} 