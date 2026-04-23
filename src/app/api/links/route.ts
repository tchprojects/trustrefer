import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SLOT_LIMIT } from "@/lib/pricing";

const submitSchema = z.object({
  brandName: z.string().min(1).max(100),
  url: z.string().url(),
  categoryId: z.string().cuid(),
  note: z.string().max(500).optional(),
});

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      where: { isApproved: true, isActive: true },
      orderBy: { voteScore: "desc" },
      include: { category: true },
    });
    return NextResponse.json({ data: links });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const { brandName, url, categoryId, note } = parsed.data;
    const userId = session.user.id;

    // Fetch user's current tier from DB (not JWT — avoid stale reads)
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { membershipTier: true },
    });
    const tier = dbUser?.membershipTier ?? "STANDARD";
    const slotLimit = SLOT_LIMIT[tier] ?? 0;

    if (slotLimit === 0) {
      return NextResponse.json(
        { error: "Your plan does not allow publishing referral links. Upgrade to Standard or Pro." },
        { status: 403 }
      );
    }

    // Count occupied slots: PENDING + APPROVED submissions + PENDING brand requests
    const [pendingCount, approvedCount, pendingBrandRequests] = await Promise.all([
      prisma.linkSubmission.count({ where: { userId, status: "PENDING" } }),
      prisma.linkSubmission.count({ where: { userId, status: "APPROVED" } }),
      prisma.brandRequest.count({ where: { userId, status: "PENDING" } }),
    ]);

    const slotsUsed = pendingCount + approvedCount + pendingBrandRequests;

    if (slotsUsed >= slotLimit) {
      return NextResponse.json(
        {
          error: `You have used all ${slotLimit} slot${slotLimit === 1 ? "" : "s"} available on your plan. Remove a pending request or upgrade your plan.`,
          slotsUsed,
          slotLimit,
        },
        { status: 429 }
      );
    }

    const submission = await prisma.linkSubmission.create({
      data: {
        userId,
        brandName,
        url,
        categoryId,
        note,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { data: submission, message: "Submission received. We'll review it shortly." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
