import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { nylas, nylasConfig } from "@/lib/nylas";
import { redirect } from "next/navigation";

export async function GET(req: NextRequest) {
  const sessoin = await auth();

  if (!sessoin?.user.id) {
    return NextResponse.json(
      { error: "Unauthenticated request" },
      { status: 401 }
    );
  }

  const authoptions = nylas.auth.urlForOAuth2({
    clientId: nylasConfig.clientId,
    redirectUri: nylasConfig.redirectUri,
  });

  return redirect(authoptions);
}
