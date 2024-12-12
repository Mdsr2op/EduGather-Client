import { Form, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpValidationSchema } from '../validations';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SignUpFormValues } from '../types';

// Sign Up Form
export function SignUpForm() {
  const form = useForm({
    resolver: zodResolver(SignUpValidationSchema),
    defaultValues: {
      username: '',
      email: '',
      fullname: '',
      avatar: '',
      coverImage: '',
      password: '',
    },
  });

  const onSubmit = (data:SignUpFormValues) => {
    console.log('Sign Up Data:', data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your username" />
              </FormControl>
              <FormMessage />
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
                <Input {...field} placeholder="Enter your email" />
              </FormControl>
              <FormMessage />
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
                <Input {...field} placeholder="Enter your full name" />
              </FormControl>
              <FormMessage />
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
                <Input {...field} placeholder="Enter avatar URL" />
              </FormControl>
              <FormMessage />
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
                <Input {...field} placeholder="Enter cover image URL" />
              </FormControl>
              <FormMessage />
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
                <Input {...field} type="password" placeholder="Enter your password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Sign Up</Button>
      </form>
    </Form>
  );
}
