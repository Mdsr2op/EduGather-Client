import { z } from "zod";

export const channelSchema = z.object({
  channelName: z.string().min(3, "Channel name must be at least 3 characters long").max(50, "Channel name must be under 50 characters"),
  channelDescription: z.string().max(200, "Description must be under 200 characters").optional(),
});