import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  linkId: z.string(),
  note: z.string().min(1, "Please describe the issue.").max(500),
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
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const { linkId, note } = parsed.data;

    const report = await prisma.report.create({
      data: { userId: session.user.id, linkId, note },
    });

    return NextResponse.json(
      { data: report, message: "Report submitted." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const reports = await prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        link: { select: { brandName: true, url: true } },
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({ data: reports });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
