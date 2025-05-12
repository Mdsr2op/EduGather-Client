import { z } from "zod";

export const GoogleProfileSetupSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  
  avatar: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "Avatar must be an image file"
    ),
}); 