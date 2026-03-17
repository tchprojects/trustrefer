import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  linkId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
    }

    const tier = (session.user as any).membershipTier;
    if (tier !== "PREMIUM") {
      return NextResponse.json(
        { error: "Waitlist is available for Premium members only." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input." }, { status: 400 });
    }

    const { linkId } = parsed.data;
    const userId = session.user.id;

    // Check if already on waitlist
    const existing = await prisma.waitlistEntry.findUnique({
      where: { userId_linkId: { userId, linkId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You are already on the waitlist for this brand." },
        { status: 409 }
      );
    }

    // Assign next FIFO position
    const count = await prisma.waitlistEntry.count({ where: { linkId } });

    const entry = await prisma.waitlistEntry.create({
      data: { userId, linkId, position: count + 1 },
    });

    return NextResponse.json(
      { data: entry, message: "You have been added to the waitlist." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
