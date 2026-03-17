import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        links: {
          where: { isApproved: true, isActive: true },
          orderBy: { voteScore: "desc" },
          include: {
            votes: { select: { type: true } },
            reports: { select: { id: true } },
            comments: { select: { id: true } },
          },
        },
      },
    });

    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
