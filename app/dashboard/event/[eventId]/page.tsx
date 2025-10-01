import { geteventvalues } from "@/action/serveraction";
import { EditEventForm } from "@/components/dashboard/newEvent/editevent"; 


export default async function EditRoute({
  params,
}: {
  params:Promise<{ eventId: string }>
}) { 
  const {eventId}=await params;
  const data = await geteventvalues(eventId);
  return (
    <EditEventForm
      description={data.description}
      duration={data.duration}
      id={data.id}
      title={data.title}
      url={data.url}
    />
  );
}
