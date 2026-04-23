import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const role = session?.user?.role ?? "";
  if (!["ADMIN", "SUPER_ADMIN"].includes(role)) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;

  const sub = await prisma.linkSubmission.findUnique({
    where: { id },
    include: { user: { select: { membershipTier: true } } },
  });
  if (!sub) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const planAtPublish = sub.user?.membershipTier ?? "STANDARD";
  const publishedAt = new Date();

  await prisma.$transaction(async (tx) => {
    const link = await tx.link.create({
      data: {
        brandName: sub.brandName,
        url: sub.url,
        categoryId: sub.categoryId,
        submittedBy: sub.userId,
        isApproved: true,
        isActive: true,
        publishedAt,
        planAtPublish,
      },
    });
    await tx.linkSubmission.update({
      where: { id },
      data: { status: "APPROVED", linkId: link.id },
    });
  });

  revalidateTag("categories", "max");

  return NextResponse.json({ message: "Approved." });
}
