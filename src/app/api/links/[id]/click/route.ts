import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.link.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
    return NextResponse.json({ message: "ok" });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
