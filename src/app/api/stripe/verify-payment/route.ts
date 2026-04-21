import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/verify-payment
 *
 * Called immediately from the success page with the Stripe checkout session ID.
 * Verifies payment directly with Stripe (no webhook dependency) and upgrades
 * the user's tier in DB right away. The webhook is still a backup but no longer
 * the critical path for activation.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { sessionId } = (await req.json()) as { sessionId: string };
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
  }

  // Retrieve session from Stripe with subscription expanded
  const cs = await getStripe().checkout.sessions.retrieve(sessionId, {
    expand: ["subscription"],
  });

  // Security: confirm this session belongs to the current user
  if (cs.metadata?.userId !== session.user.id) {
    return NextResponse.json({ error: "Session mismatch" }, { status: 403 });
  }

  // Must be fully paid
  if (cs.status !== "complete" || cs.payment_status !== "paid") {
    return NextResponse.json(
      { error: "Payment not completed", status: cs.payment_status },
      { status: 402 }
    );
  }

  const plan = cs.metadata?.plan as "STARTER" | "PREMIUM" | undefined;
  if (!plan) {
    return NextResponse.json({ error: "No plan in session metadata" }, { status: 400 });
  }

  // If webhook already fired and upgraded the user, just return
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { membershipTier: true },
  });
  if (dbUser?.membershipTier === plan) {
    return NextResponse.json({ membershipTier: plan });
  }

  // Webhook hasn't fired yet — apply the upgrade ourselves
  const stripeSubId =
    typeof cs.subscription === "string" ? cs.subscription : cs.subscription?.id ?? null;
  const customerId =
    typeof cs.customer === "string" ? cs.customer : (cs.customer as { id: string } | null)?.id ?? null;

  const stripeSub = stripeSubId
    ? await getStripe().subscriptions.retrieve(stripeSubId)
    : null;

  // Stripe SDK v20 moved current_period_end to items.data[0].current_period_end.
  // Fall back to the subscription-level field for older API versions, then to null.
  const rawPeriodEnd =
    stripeSub?.items.data[0]?.current_period_end ??
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (stripeSub as any)?.current_period_end ??
    null;
  const periodEnd =
    typeof rawPeriodEnd === "number" && isFinite(rawPeriodEnd)
      ? new Date(rawPeriodEnd * 1000)
      : null;

  const priceId = stripeSub?.items.data[0]?.price.id ?? null;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { membershipTier: plan },
    }),
    prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: {
        ...(customerId ? { stripeCustomerId: customerId } : {}),
        ...(stripeSubId ? { stripeSubscriptionId: stripeSubId } : {}),
        ...(priceId ? { stripePriceId: priceId } : {}),
        status: "ACTIVE",
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      },
      create: {
        userId: session.user.id,
        stripeCustomerId: customerId ?? "",
        stripeSubscriptionId: stripeSubId ?? "",
        stripePriceId: priceId ?? "",
        status: "ACTIVE",
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      },
    }),
  ]);

  return NextResponse.json({ membershipTier: plan });
}
