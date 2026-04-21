import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!subscription?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account found" }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://trustrefer.co.uk";

  const portalSession = await getStripe().billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${appUrl}/account`,
  });

  return NextResponse.json({ url: portalSession.url });
}
