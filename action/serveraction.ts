"use server";
import { auth } from "@/auth";
import { nylas } from "@/lib/nylas";
import prisma from "@/lib/prisma";
import { eventType, eventTypeSchema, onboardingSchema } from "@/lib/types";
import { EventType, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { tr } from "zod/v4/locales";

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

export const handleAvailabilityAction = async (values: FormData) => {
  const session = await auth();
  if (!session?.user) {
    return;
  }
  const rawData = Object.fromEntries(values.entries());
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
    console.error("something went wrong while updating the list");
  }
};

export const createEvent = async (values: eventType) => {
  const session = await auth();
  if (!session?.user.id) {
    return { data: null, error: "Unauthorized request" };
  }
  try {
    const validatedata = eventTypeSchema.safeParse(values);
    if (!validatedata.success) {
      return { data: null, error: z.treeifyError(validatedata.error) };
    }
    const { data } = validatedata;
    const updateevent = await prisma.eventType.create({
      data: {
        title: data.title,
        description: data.description,
        url: data.url,
        duration: data.duration,
        videoCallSoftware: data.videoCallSoftware,
        userId: session?.user.id,
      },
    });
    revalidatePath("/dashboard");
    return { data: updateevent, error: null };
  } catch (error) {
    console.error("error while creating the event ");
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        // Unique constraint failed
        return { data: null, error: "Url is already takne" };
      }
    }
    return { data: null, error: "Internal server error " };
  }
};

export const updateEventAction = async (
  values: Partial<EventType>,
  id: string
) => {
  const session = await auth();
  if (!session?.user) {
    return { success: false, error: "Unauthenticated request" };
  }

  try {
    const update = await prisma.eventType.update({
      where: {
        id,
      },
      data: {
        ...values,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, error: null };
  } catch (error) {
    console.error("something went wrong while updating the event ");
    return { success: false, error: "Internal sever error" };
  }
};

export const getBookingdetails = async (userName: string, eventUrl: string) => {
  return prisma.eventType.findFirst({
    where: {
      url: eventUrl,
      User: {
        userName: userName,
      },
    },
    select: {
      id: true,
      description: true,
      title: true,
      duration: true,
      videoCallSoftware: true,
      User: {
        select: {
          image: true,
          name: true,
          availability: {
            select: {
              day: true,
              isActive: true,
            },
          },
        },
      },
    },
  });
};

export const CreateMeetingAction = async (formData: FormData) =>{
  const getUserData = await prisma.user.findUnique({
    where: {
      userName: formData.get("username") as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!getUserData) {
    throw new Error("User not Found");
  }

  const eventTypeData = await prisma.eventType.findUnique({
    where: {
      id: formData.get("eventTypeId") as string,
    },
    select: {
      title: true,
      description: true,
    },
  });

  const fromTime = formData.get("fromTime") as string;
  const eventDate = formData.get("eventDate") as string;
  const meetingLength = Number(formData.get("meetingLength"));
  const provider = formData.get("provider") as string;

  const startDateTime = new Date(`${eventDate}T${fromTime}:00`);

  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);
  console.log(getUserData,"data")
  await nylas.events.create({
    identifier: getUserData.grantId as string,
    requestBody: {
      title: eventTypeData?.title,
      description: eventTypeData?.description,
      when: {
        startTime: Math.floor(startDateTime.getTime() / 1000),
        endTime: Math.floor(endDateTime.getTime() / 1000),
      },
      conferencing: {
        autocreate: {},
        provider: provider as any,
      },
      participants: [
        {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          status: "yes",
        },
      ],
    },
    queryParams: {
      calendarId: getUserData.grantEmail as string,
      notifyParticipants: true,
    },
  });  

  console.log("hello")

  return redirect("/success");
}

export const getEventsDetails = async () => {
  const session = await auth();
  if (!session?.user.id) {
    return redirect("/");
  }

  const getUserDeatils = await prisma.user.findUnique({
    where: {
      id: session?.user.id,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!getUserDeatils) {
    throw new Error("User Node found");
  }

  const data = await nylas.events.list({
    identifier: getUserDeatils.grantId as string,
    queryParams: {
      calendarId: getUserDeatils.grantEmail as string,
    },
  });

  return data;
};


export const cancelMeetingAction=async(val:FormData)=>{

}