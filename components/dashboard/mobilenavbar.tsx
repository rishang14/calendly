import React from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet"; 
import { MenuIcon } from "lucide-react";
import Sidebarlinks from "./sidebarlinks";
import { Button } from "../ui/button"; 
import Logo from "@/public/logo.png"

const MobileNavBar = () => {
  return (
      <Sheet>
        <SheetTrigger asChild>
          <Button  className=" md:hidden shrink-0">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left"> 
          <SheetTitle className=" flex items-center justify-center pt-5  gap-2"><Image src={Logo} alt="Logo" className="size-8" />
              <p className="text-xl font-bold text-blue-400/80">Calendly</p></SheetTitle>
          <nav className="grid gap-2 mt-3">
            <Sidebarlinks />
          </nav>
        </SheetContent>
      </Sheet>
  );
};

export default MobileNavBar;
