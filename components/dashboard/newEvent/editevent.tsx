"use client";
import { useEffect } from "react";
import { eventType, eventTypeSchema } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventType } from "@prisma/client";
import { updateEventAction } from "@/action/serveraction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface iAppProps {
  id: string;
  title: string;
  url: string;
  description: string;
  duration: number;
}

const OptionalUserSchema = eventTypeSchema.partial();
export function EditEventForm({
  description,
  duration,
  id,
  title,
  url,
}: iAppProps) {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<Partial<eventType>>({
    mode: "onChange",
    resolver: zodResolver(OptionalUserSchema),
    defaultValues: {
      title: "",
      duration: duration,
      url: "",
      description: "",
    },
  });

  useEffect(() => {
    if (id && title && duration && url && description) {
      reset({
        title,
        description,
        url,
        duration,
      });
    }
  }, [id, title, duration, url, description, reset]);

  const onsubmit = async (data: Partial<EventType>) => {
    const { success, error } = await updateEventAction(data, id);
    if (error) {
      toast.error("Server Error", { duration: 3000, description: error });
      router.refresh();
      return;
    }
    toast.success("Congratulation", {
      description: "Edition Completed",
      duration: 3000,
    }); 
    router.replace("/dashboard");
  };

  console.log(duration, "duration");
  return (
    <div className="w-full h-full flex flex-1 items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Edit appointment type</CardTitle>
          <CardDescription>
            Edit your appointment type that allows people to book you!
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onsubmit)}>
          <input type="hidden" name="id" value={id} />
          <CardContent className="grid gap-y-5">
            <div className="flex flex-col gap-y-2">
              <Label>Title</Label>
              <Input
                placeholder="30 Minute meeting"
                disabled={isSubmitting}
                {...register("title")}
              />
              <p className="text-red-500 text-sm">{errors?.title?.message}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <Label>URL Slug</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  CalMarshal.com/
                </span>
                <Input
                  {...register("url")}
                  disabled={isSubmitting}
                  className="rounded-l-none"
                  placeholder="Example-url-1"
                />
              </div>
              <p className="text-red-500 text-sm">{errors?.url?.message}</p>
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Description</Label>
              <Textarea
                {...register("description")}
                disabled={isSubmitting}
                placeholder="Meet me in this meeting to meet me!"
              />
              <p className="text-red-500 text-sm">
                {errors.description?.message}
              </p>
            </div>

            <div className="flex flex-col gap-y-2">
              <Label>Duration</Label>
              <Controller
                control={control}
                name="duration"
                render={({ field }) => (
                  <Select
                    disabled={isSubmitting}
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Duration</SelectLabel>
                        <SelectItem value="15">15 Mins</SelectItem>
                        <SelectItem value="30">30 Mins</SelectItem>
                        <SelectItem value="45">45 Mins</SelectItem>
                        <SelectItem value="60">1 Hour</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-red-500 text-sm">{errors.duration?.message}</p>
            </div>
          </CardContent>
          <CardFooter className="w-full flex justify-between">
            <Button variant="secondary" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" className="text-white">
              {isSubmitting ? "Editing" : "Edit event type "}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
