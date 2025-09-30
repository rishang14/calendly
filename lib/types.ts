import { Exo } from "next/font/google";
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
  name: z.string().min(3).max(150),
  image: z.string(),
});

export type settingType = z.infer<typeof settingsSchema>;

export const eventTypeSchema = z.object({
  title: z.string().min(3).max(150),
  duration: z.number().min(15).max(60),
  url: z.string().min(3).max(150),
  description: z.string().min(3).max(300),
  videoCallSoftware: z.string().min(3),
});

export type eventType = z.infer<typeof eventTypeSchema>;
