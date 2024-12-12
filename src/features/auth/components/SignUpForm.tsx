import { useForm } from "react-hook-form";
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
import { SignUpFormValues } from "../types";

export function SignUpForm() {
  const form = useForm({
    resolver: zodResolver(SignUpValidationSchema),
    defaultValues: {
      username: "",
      email: "",
      fullname: "",
      avatar: "",
      coverImage: "",
      password: "",
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    console.log("Sign Up Data:", data);
  };

  return (
    <section className="flex flex-1 justify-center items-center flex-col py-10">
      <Form {...form}>
        <div className="sm:w-420 lg:w-[930px] flex justify-center items-center flex-col">
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
            Create a new account
          </h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">
            To use the app, enter the details
          </p>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5 gap-x-14 w-full mt-10 max-h-[400px] flex-wrap"
          >
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
                      className="shad-input"
                      placeholder="eg. johndoe"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
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
                      className="shad-input"
                      placeholder="eg. johndoe123@example.com"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
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
                      className="shad-input"
                      placeholder="eg. John Doe"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              name="avatar"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar (URL)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="shad-input"
                      placeholder="Enter avatar URL"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <FormField
              name="coverImage"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image (URL)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      className="shad-input"
                      placeholder="Enter cover image URL"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
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
                      className="shad-input"
                      placeholder="Enter your password"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <Button className="shad-button_primary" type="submit">
              Submit
            </Button>
            <p className="text-small-regular text-light-2 text-center -mt-2">
              Already have an account?
              <a href="/sign-in">
                <span className="text-primary-500 text-small-semibold ml-1">
                  Sign in
                </span>
              </a>
            </p>
          </form>
        </div>
      </Form>
    </section>
  );
}
