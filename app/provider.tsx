"use client"
import React from "react";
import { ThemeProvider as NextThemeprovider } from "next-themes";
import { SessionProvider } from "next-auth/react";

const Provider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemeprovider>) => {
  return (
    <NextThemeprovider {...props}>
      <SessionProvider>
        {children}
        {/* <Toaster /> */}
      </SessionProvider>
    </NextThemeprovider>
  );
};

export default Provider;
