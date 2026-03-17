import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { id } = await params;
    await prisma.brandRequest.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    return NextResponse.json({ message: "Request rejected." });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
