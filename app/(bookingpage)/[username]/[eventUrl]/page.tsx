import { auth } from "@/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { CalendarX2, Clock, VideoIcon } from "lucide-react";
import { notFound, redirect } from "next/navigation";

type Params = {
  username: string;
  eventUrl: string;
};

const Booking = async ({ params }: { params: Promise<Params> }) => {
  const session = await auth();
  if (!session?.user) {
    return redirect("/");
  }
  const { username, eventUrl } = await params;

  const data = await prisma.eventType.findFirst({
    where: {
      url: eventUrl,
      User: {
        userName: username,
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

  if (!data) {
    return notFound();
  }
  console.log(data, "datas");
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="w-full max-w-[1000px] mx-auto">
        <CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr] gap-4">
          <div>
            <img
              src={data.User?.image as string}
              alt="Profile Image of user"
              className="size-10 rounded-full"
            />
            <p className="text-sm font-medium text-muted-foreground mt-1">
              {data.User?.name}
            </p>
            <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
            <p className="text-sm font-medium text-muted-foreground">
              {data.description}
            </p>

            <div className="mt-5 flex flex-col gap-y-3">
              <p className="flex items-center">
                <CalendarX2 className="size-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {/* {formattedDate} */}
                </span>
              </p>

              <p className="flex items-center">
                <Clock className="size-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {data.duration} Minutes
                </span>
              </p>

              <p className="flex items-center">
                <VideoIcon className="size-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  {data.videoCallSoftware}
                </span>
              </p>
            </div>
          </div>

          <Separator orientation="vertical" className="h-full w-[5px]" />

          {/* <RenderCalendar availability={data.User?.availability as any} /> */} 
          <div>helo</div>

          <Separator orientation="vertical" className="h-full w-[5px] border-gray-300" />

          {/* <TimeTable
              duration={data.duration}
              selectedDate={selectedDate}
              userName={params.username}
            /> */} 
            <div>hello</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Booking;
