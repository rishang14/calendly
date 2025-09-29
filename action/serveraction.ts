"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { onboardingSchema } from "@/lib/types";
import { Prisma } from "@prisma/client";

export const changeUserdetails = async (name: string, userName: string) => {
  const session = await auth();
  if (!session) return { data: null, error: "Not authenticated" };
  const userdetails = {
    name,
    userName,
  };
  const validate = onboardingSchema.safeParse(userdetails);
  if (!validate.success) {
    return { data: null, error: validate.error.message };
  }
  try {
    const updatedUserName =await prisma.user.update({
      where: { id: session?.user.id as string },
      data: {
        name,
        userName,
      },
    });
    return { data: updatedUserName, error: null };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Unique constraint failed
        return { data: null, error: "Username is already taken" };
      }
    }
    console.error("while updating the onboarding form");
    return { data: null, error: "Internal server error" };
  }
};
