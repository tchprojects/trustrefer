import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  linkId: z.string(),
  type: z.enum(["UP", "DOWN"]),
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

    const { linkId, type } = parsed.data;
    const userId = session.user.id;

    const existing = await prisma.vote.findUnique({
      where: { userId_linkId: { userId, linkId } },
    });

    await prisma.$transaction(async (tx) => {
      if (existing) {
        if (existing.type === type) {
          // Toggle off — remove vote
          await tx.vote.delete({ where: { id: existing.id } });
          await tx.link.update({
            where: { id: linkId },
            data: { voteScore: { increment: type === "UP" ? -1 : 1 } },
          });
        } else {
          // Change vote
          await tx.vote.update({ where: { id: existing.id }, data: { type } });
          await tx.link.update({
            where: { id: linkId },
            data: { voteScore: { increment: type === "UP" ? 2 : -2 } },
          });
        }
      } else {
        await tx.vote.create({ data: { userId, linkId, type } });
        await tx.link.update({
          where: { id: linkId },
          data: { voteScore: { increment: type === "UP" ? 1 : -1 } },
        });
      }
    });

    return NextResponse.json({ message: "Vote recorded." });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
