"use server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { onboardingSchema } from "@/lib/types";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
    const updatedUserName = await prisma.user.update({
      where: { id: session?.user.id as string },
      data: {
        name,
        userName,
        availability: {
          createMany: {
            data: [
              {
                day: "Monday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
              {
                day: "Tuesday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
              {
                day: "Wednesday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
              {
                day: "Thursday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
              {
                day: "Friday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
              {
                day: "Saturday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
              {
                day: "Sunday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
            ],
          },
        },
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

export const handleAvailabilityAction = async (formdata: FormData) => {
  const session = await auth(); 
  if(!session?.user){
    return;
  }
  const rawData = Object.fromEntries(formdata.entries());
  const availabilityData = Object.keys(rawData)
    .filter((keys) => keys.startsWith("id-"))
    .map((item) => {
      const id = item.replace("id-", "");
      return {
        id,
        isActive: rawData[`isActive-${id}`] === "on",
        fromTime: rawData[`fromTime-${id}`] as string,
        tillTime: rawData[`tillTime-${id}`] as string,
      };
    });

  try {
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: {
            id: item.id,
          },
          data: {
            isActive: item.isActive,
            fromTime: item.fromTime,
            tillTime: item.tillTime,
          },
        })
      )
    );
    revalidatePath("/dashboard/availability");
  } catch (error) {
    console.error("something went wrong while updating the list")
  }
};
