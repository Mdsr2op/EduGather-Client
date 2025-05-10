import { z } from "zod";

export const ForgotPasswordValidationSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .email("Please enter a valid email address")
}); 