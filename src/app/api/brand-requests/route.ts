import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SLOT_LIMIT } from "@/lib/pricing";

const schema = z.object({
  categoryId: z.string(),
  brandName: z.string().min(1).max(100),
  note: z.string().max(300).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const { categoryId, brandName, note } = parsed.data;
    const userId = session.user.id;

    // Fetch current tier from DB (not JWT)
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { membershipTier: true },
    });
    const tier = dbUser?.membershipTier ?? "STANDARD";
    const slotLimit = SLOT_LIMIT[tier] ?? 0;

    if (slotLimit === 0) {
      return NextResponse.json(
        { error: "Your plan does not allow brand requests. Upgrade to Standard or Pro." },
        { status: 403 }
      );
    }

    // Prevent duplicate brand requests for same user+brand+category
    const existing = await prisma.brandRequest.findUnique({
      where: { userId_brandName_categoryId: { userId, brandName, categoryId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted a request for this brand in this category." },
        { status: 409 }
      );
    }

    // Count total occupied slots: PENDING + APPROVED link submissions + PENDING brand requests
    const [pendingSubmissions, approvedSubmissions, pendingBrandRequests] = await Promise.all([
      prisma.linkSubmission.count({ where: { userId, status: "PENDING" } }),
      prisma.linkSubmission.count({ where: { userId, status: "APPROVED" } }),
      prisma.brandRequest.count({ where: { userId, status: "PENDING" } }),
    ]);

    const slotsUsed = pendingSubmissions + approvedSubmissions + pendingBrandRequests;

    if (slotsUsed >= slotLimit) {
      return NextResponse.json(
        {
          error: `You have used all ${slotLimit} slot${slotLimit === 1 ? "" : "s"} available on your plan.`,
          slotsUsed,
          slotLimit,
        },
        { status: 429 }
      );
    }

    const request = await prisma.brandRequest.create({
      data: { userId, categoryId, brandName, note },
    });

    return NextResponse.json(
      { data: request, message: "Request submitted." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
