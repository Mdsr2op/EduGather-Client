import { z } from "zod";

export const SignInValidationSchema = z.object({
  usernameOrEmail: z
    .string()
    .nonempty("Username or Email is required")
    .refine(
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^[a-zA-Z0-9_=\-{}\,!?\`\~]+$/.test(value),
      "Must be a valid email or username"
    ),
  password: z
    .string()
    .min(0, "Password is required")
});
