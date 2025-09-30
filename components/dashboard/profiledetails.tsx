import React from "react";
import { auth, signOut } from "@/auth";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

const Profiledetails = async () => {
  const session = await auth();  
  if(!session?.user) return;
  return (
    <div className="ml-auto flex items-center gap-x-4">
      <DropdownMenu>
        <DropdownMenuTrigger >
          <Avatar className="cursor-pointer">
            <AvatarImage src={session.user.image as string ?? " "} sizes="20" height={20} />
            <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <form
              className="w-full"
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button variant={"link"} className="w-full text-left text-white">Log out</Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profiledetails;
