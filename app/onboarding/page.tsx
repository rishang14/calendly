import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Onboardingform from "@/components/onboarding/onboardingform";


const Onboarding = async() => { 
const session=await auth(); 
if(!session) return redirect("/");
  return (
    <div className=" h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Calendly</CardTitle>
          <CardDescription>
            We need the following information to set up your profile!
          </CardDescription>
        </CardHeader>
         <Onboardingform/>
      </Card>
    </div>
  );
};

export default Onboarding;
