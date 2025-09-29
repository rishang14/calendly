import React from "react"; 
import { signIn } from "@/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import Logo from "@/public/logo.png";
import GoogleIcon from "@/public/google.svg";
const AuthDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="text-white">Try Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle className=" flex items-center justify-center gap-2 text-2xl text-blue-400/80">
            <Image src={Logo} alt="logo" className="size-8" />
            Calendly
          </DialogTitle>
        </DialogHeader>
        <div className=" py-4  ">
          <form className=" w-full flex justify-center "
          action={async () => {
                "use server";
                await signIn('google');
              }}
          >
            <Button className="text-white">
              <Image
                src={GoogleIcon}
                className=" size-5"
                alt="google icon"
              ></Image>{" "}
              Sign in with Google
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
