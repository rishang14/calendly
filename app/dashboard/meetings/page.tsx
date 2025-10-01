import React from 'react'
import { cancelMeetingAction, getEventsDetails } from '@/action/serveraction'
import { EmptyState } from '@/components/dashboard/emptystate'; 
import { Card,CardHeader,CardTitle,CardDescription,CardContent } from '@/components/ui/card'; 
import { Separator } from '@/components/ui/separator'; 
import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Meetings = async() => { 
const data= await getEventsDetails(); 

  return (
   <> {data.data.length < 1 ? (
        <EmptyState
          title="No meetings found"
          description="You dont have any meetings yet."
          buttonText="Create a new event type"
          href="/dashboard/new"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              See upcoming event which where booked with you and see the event
              type link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.data.map((item) => (
              <form action={cancelMeetingAction} key={item.id}>
                <input type="hidden" name="eventId" value={item.id} />
                <div className="grid grid-cols-3 justify-between items-center">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {/* @ts-ignore */}
                      {format(fromUnixTime(item.when.startTime), "EEE, dd MMM")}
                    </p>

                    <p className="text-muted-foreground text-xs pt-1">
                      {/* @ts-ignore */}
                      {format(fromUnixTime(item.when.startTime), "hh:mm a")} -
                      {/* @ts-ignore */}
                      {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                    </p>

                    <div className="flex items-center mt-1">
                      <Video className="size-4 mr-2 text-primary" />

                      <a
                        className="text-xs text-primary underline underline-offset-4"
                        //@ts-ignore
                        href={item.conferencing.details.url}
                        target="_blank"
                      >
                        Join Meeting
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-col items-start">
                    <h2 className="text-sm font-medium">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      You and {item.participants[0].name}
                    </p>
                  </div>

                  <Button className="w-fit flex ml-auto" variant={"destructive"}>
                   Cancel Event
                  </Button>
                </div>
                <Separator className="my-3" />
              </form>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  )
}

export default Meetings