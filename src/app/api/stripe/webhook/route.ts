import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export const dynamic = "force-dynamic";

// Raw body needed for Stripe signature verification
export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const cs = event.data.object as Stripe.Checkout.Session;
      if (cs.mode !== "subscription") break;

      const userId = cs.metadata?.userId;
      const plan = cs.metadata?.plan as "STARTER" | "PREMIUM" | undefined;
      const stripeSubscriptionId = cs.subscription as string;
      const customerId = cs.customer as string;

      if (!userId || !plan) break;

      const sub = await getStripe().subscriptions.retrieve(stripeSubscriptionId);

      await prisma.$transaction([
        prisma.subscription.upsert({
          where: { userId },
          update: {
            stripeCustomerId: customerId,
            stripeSubscriptionId,
            stripePriceId: sub.items.data[0].price.id,
            status: "ACTIVE",
            currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
            cancelAtPeriodEnd: false,
          },
          create: {
            userId,
            stripeCustomerId: customerId,
            stripeSubscriptionId,
            stripePriceId: sub.items.data[0].price.id,
            status: "ACTIVE",
            currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
            cancelAtPeriodEnd: false,
          },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { membershipTier: plan },
        }),
      ]);
      break;
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (!userId) break;

      const status = sub.status === "active" ? "ACTIVE"
        : sub.status === "past_due" ? "PAST_DUE"
        : sub.status === "canceled" ? "CANCELED"
        : "INACTIVE";

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: sub.id },
        data: {
          status,
          currentPeriodEnd: new Date((sub as any).current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.userId;
      if (!userId) break;

      // Downgrade user to free tier and deactivate their links
      await prisma.$transaction([
        prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "CANCELED", cancelAtPeriodEnd: false },
        }),
        prisma.user.update({
          where: { id: userId },
          data: { membershipTier: "STANDARD" },
        }),
        // Deactivate all their published links
        prisma.link.updateMany({
          where: { submittedBy: userId, isApproved: true },
          data: { isActive: false },
        }),
      ]);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
