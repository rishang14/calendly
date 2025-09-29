import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"
 
export default { 
    providers: [Google({
      id: "google",
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string, 
      allowDangerousEmailAccountLinking: true,
    })]

 } satisfies NextAuthConfig