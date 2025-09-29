import { z } from "zod";

export const onboardingSchema = z.object({
  name: z.string().min(3).max(150),
  userName: z
    .string()
    .min(3)
    .max(150)
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: "Username can only contain letters, number and -",
    }),
});
export type onbooadingType = z.infer<typeof onboardingSchema>;
export const settingsSchema = z.object({
  fullName: z.string().min(3).max(150),

  profileImage: z.string(),
});

export const eventTypeSchema = z.object({
  title: z.string().min(3).max(150),
  duration: z.number().min(15).max(60),
  url: z.string().min(3).max(150),
  description: z.string().min(3).max(300),
  videoCallSoftware: z.string().min(3),
});
