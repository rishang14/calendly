import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { MenuIcon } from "lucide-react";
import Sidebarlinks from "./sidebarlinks";
import { Button } from "../ui/button";

const MobileNavBar = () => {
  return (
      <Sheet>
        <SheetTrigger asChild>
          <Button  className=" md:hidden shrink-0">
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-2 mt-10">
            <Sidebarlinks />
          </nav>
        </SheetContent>
      </Sheet>
  );
};

export default MobileNavBar;
