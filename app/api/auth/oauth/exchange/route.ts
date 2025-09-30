import { auth } from "@/auth";
import { nylas, nylasConfig } from "@/lib/nylas";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user.id) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 401 }
    );
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "No authorization code returned from Nylas" },
      { status: 400 }
    );
  }    

   try {
    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId,
      code,
      redirectUri: nylasConfig.redirectUri,
    });

    const { grantId,email } = response;

    await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        grantId: grantId,
        grantEmail: email,
      },
    });   

    return redirect("/dashboard");
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return NextResponse.json({error:"Failed to exchange authorization code for token"},{status:500});
  }   
}
