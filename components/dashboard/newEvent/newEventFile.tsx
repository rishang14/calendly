"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ButtonGroup } from "@/components/ui/buttongroup";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventTypeSchema, eventType } from "@/lib/types";
import { createEvent } from "@/action/serveraction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const NewEventForm = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<eventType>({
    mode: "onChange",
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      title: "",
      duration: 15,
      url: "",
      description: "",
      videoCallSoftware: "Google Meet",
    },
  });
  const videoProvider = watch("videoCallSoftware");
  const onsubmit = async (datas: eventType) => {
    try {
      const { data, error } = await createEvent(datas);
      if (error) {
        toast.error("Server Error", {
          duration: 3000,
          description: error.toString,
        });
      }

      toast.success("Congratulation", {
        duration: 3000,
        description: "Event created Successfully",
      });
      router.replace("/dashboard");
    } catch (error) {
      toast.error("Exception", {
        duration: 3000,
        description: "Uncaughted error pls try again",
      });
    }finally{
    reset()
  }
  };
  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <CardContent className="grid gap-y-5">
        <div className="flex flex-col gap-y-2">
          <Label>Title</Label>
          <Input
            {...register("title")}
            placeholder="30 Minute meeting"
            disabled={isSubmitting}
          />
          <p className="text-red-500 text-sm">{errors?.title?.message}</p>
        </div>
        <div className="flex flex-col gap-y-2">
          <Label>URL Slug</Label>
          <div className="flex rounded-md">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
              calendly.com/
            </span>
            <Input
              disabled={isSubmitting}
              {...register("url")}
              className="rounded-l-none"
              placeholder="Example-url-1"
            />
          </div>
          <p className="text-red-500 text-sm">{errors.url?.message}</p>
        </div>

        <div className="flex flex-col gap-y-2">
          <Label>Description</Label>
          <Textarea
            disabled={isSubmitting}
            {...register("description")}
            placeholder="Meet me in this meeting to meet me!"
          />
          <p className="text-red-500 text-sm">{errors?.description?.message}</p>
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
        <div className="grid gap-y-2">
          <div className=" flex gap-3">
            <Label>Video Call Provider</Label> :{" "}
            <span className="text-gray-300">{videoProvider}</span>
          </div>
          <Controller
            control={control}
            name="videoCallSoftware"
            render={({ field }) => (
              <ButtonGroup>
                {["Google Meet"].map(
                  (provider) => (
                    <Button
                      disabled={isSubmitting}
                      key={provider}
                      type="button"
                      onClick={() => field.onChange(provider)}
                      className="w-full"
                      variant={
                        field.value === provider ? "secondary" : "outline"
                      }
                    >
                      {provider}
                    </Button>
                  )
                )}
              </ButtonGroup>
            )}
          />
          <p className="text-red-500 text-sm">
            {errors.videoCallSoftware?.message}
          </p>
        </div>
      </CardContent>
      <CardFooter className="w-full flex justify-between">
        <Button type="button" variant="secondary" asChild>
          <Link href="/dashboard" className="text-white">
            Cancel
          </Link>
        </Button>

        <Button type="submit" disabled={isSubmitting} className="text-white">
          {isSubmitting ? "Create new Events" : "Create new events"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default NewEventForm;
