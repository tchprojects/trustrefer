import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription?.stripeSubscriptionId) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  // Cancel at period end — user keeps access until the billing period ends
  await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  await prisma.subscription.update({
    where: { userId: session.user.id },
    data: { cancelAtPeriodEnd: true },
  });

  return NextResponse.json({ success: true });
}
