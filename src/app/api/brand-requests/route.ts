import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BRAND_REQUEST_QUOTA } from "@/lib/pricing";

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
    const tier = (session.user as any).membershipTier as "STANDARD" | "PREMIUM";
    const quota = BRAND_REQUEST_QUOTA[tier] ?? BRAND_REQUEST_QUOTA.STANDARD;

    // Count requests in the current calendar month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const countThisMonth = await prisma.brandRequest.count({
      where: {
        userId,
        createdAt: { gte: monthStart, lt: monthEnd },
      },
    });

    if (countThisMonth >= quota) {
      return NextResponse.json(
        {
          error: `You have reached your monthly limit of ${quota} brand request${quota === 1 ? "" : "s"}.`,
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
