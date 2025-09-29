"use client"
import React from "react";
import { ThemeProvider as NextThemeprovider } from "next-themes";
import { SessionProvider } from "next-auth/react";  
import { Toaster } from "@/components/ui/sonner";

const Provider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemeprovider>) => {
  return (
    <NextThemeprovider {...props}>
      <SessionProvider>
        {children}
        <Toaster />
      </SessionProvider>
    </NextThemeprovider>
  );
};

export default Provider;
