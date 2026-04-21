import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { PLANS, PLAN_TIER_TO_SLUG } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json() as { plan: "STARTER" | "PREMIUM" };

  const planConfig = PLANS[plan];
  if (!planConfig || !planConfig.stripePriceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const userId = session.user.id;
  const userEmail = session.user.email!;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://trustrefer.co.uk";

  // Get or create Stripe customer
  let subscription = await prisma.subscription.findUnique({ where: { userId } });
  let customerId = subscription?.stripeCustomerId;

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: userEmail,
      metadata: { userId },
    });
    customerId = customer.id;
  }

  const checkoutSession = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: planConfig.stripePriceId, quantity: 1 }],
    // success: land on our activation page which polls DB and refreshes the JWT
    success_url: `${appUrl}/checkout/success`,
    // cancel: return user to the plan review page so they can try again
    cancel_url: `${appUrl}/checkout?plan=${PLAN_TIER_TO_SLUG[plan]}`,
    metadata: { userId, plan },
    subscription_data: {
      metadata: { userId, plan },
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
