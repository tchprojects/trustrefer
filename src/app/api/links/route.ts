import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    const submission = await prisma.linkSubmission.create({
      data: {
        userId: session.user.id,
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
