import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import Sidebarlinks from "@/components/dashboard/sidebarlinks";
import MobileNavBar from "@/components/dashboard/mobilenavbar";
import Profiledetails from "@/components/dashboard/profiledetails";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

const Dashboardlayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const getUserNameDetail = await prisma.user.findFirst({
    where: { id: session?.user.id },
    select: {
      userName: true,
      grantId: true,
    },
  }); 

  if (!getUserNameDetail?.userName) {
    return redirect("/onboarding");
  }
  if (!getUserNameDetail?.grantId) {
    return redirect("/onboarding/grantId");
  }
  return (
    <div className="min-h-screen w-full grid md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden md:block border-r bg-muted/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src={Logo} alt="Logo" className="size-8" />
              <p className="text-xl font-bold text-blue-400/80">Calendly</p>
            </Link>
          </div>

          <div className="flex-1">
            <nav className="grid items-start px-2 lg:px-4">
              <Sidebarlinks />
            </nav>
          </div>
        </div>
      </div>
      <div className=" flex-col flex">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileNavBar />
          <Profiledetails />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboardlayout;
