import { z } from "zod";

export const SignUpValidationSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  
  email: z.string()
    .email("Invalid email address"),
  
  fullname: z.string()
    .min(2, "Full name must be at least 2 characters long")
    .max(50, "Full name must be less than 50 characters"),
  
  avatar: z.string()
    .url("Avatar must be a valid URL")
    .optional(),
  
  coverImage: z.string()
    .url("Cover image must be a valid URL")
    .optional(), // Cover image is optional
  
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
});
