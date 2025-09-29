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

const Profiledetails = async () => {
  const session = await auth();  
  if(!session) return;
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
            <Link href="/dashboard/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <form
              className="w-full"
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="w-full text-left">Log out</button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Profiledetails;
