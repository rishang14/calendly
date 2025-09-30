"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { onboardingSchema, onbooadingType } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeUserdetails } from "@/action/serveraction";
import { toast } from "sonner";
const Onboardingform = () => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<onbooadingType>({
    mode: "onChange",
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      name: "",
      userName: "",
    },
  });
  const onsubmit = async (values: onbooadingType) => {
    try {
      const { data, error } = await changeUserdetails(
        values.name,
        values.userName
      );

      if (error) {
        toast.error("Server Error", { duration: 3000, description: error });
        return;
      }
      toast.success("Successful", {
        duration: 3000,
        description: "Congratulation you are onboarded",
      });
      router.replace("/onboarding/grantid");
    } catch (error) {
    } finally {
      reset();
    }
  };
  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <CardContent className="flex flex-col gap-y-5">
        <div className="grid gap-y-2">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            {...register("name")}
            disabled={isSubmitting}
            placeholder="john "
          />
          <p className="text-red-500 text-sm">{errors.name?.message}</p>
        </div>
        <div className="grid gap-y-2">
          <Label htmlFor="username">Username</Label>
          <div className="flex rounded-md">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-sm text-muted-foreground">
              calendly.com/
            </span>
            <Input
              placeholder="example-user-1"
              className="rounded-l-none"
              {...register("userName")}
              disabled={isSubmitting}
            />
          </div>
          <p className="text-red-500 text-sm">{errors?.userName?.message}</p>
        </div>
      </CardContent>
      <CardFooter className="mt-4">
        <Button
          disabled={isSubmitting}
          type="submit"
          className="w-full text-white"
        >
          {isSubmitting ? "Submitting" : "Submit"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default Onboardingform;
