import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;

  const sub = await prisma.linkSubmission.findUnique({ where: { id } });
  if (!sub) return NextResponse.json({ error: "Not found." }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    const link = await tx.link.create({
      data: {
        brandName: sub.brandName,
        url: sub.url,
        categoryId: sub.categoryId,
        submittedBy: sub.userId,
        isApproved: true,
        isActive: true,
      },
    });
    await tx.linkSubmission.update({
      where: { id },
      data: { status: "APPROVED", linkId: link.id },
    });
  });

  return NextResponse.json({ message: "Approved." });
}
