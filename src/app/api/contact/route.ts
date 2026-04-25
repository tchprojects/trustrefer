import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const schema = z.object({
  reason: z.enum(["expired", "inaccurate", "broken", "spam", "inappropriate", "other"]),
  brandOrUrl: z.string().min(1).max(300),
  details: z.string().max(1000).optional(),
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid submission. Please check your input and try again." },
        { status: 400 }
      );
    }

    await prisma.auditLog.create({
      data: {
        userId: session?.user?.id ?? null,
        action: "CONTACT_REPORT",
        ip: req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null,
        userAgent: req.headers.get("user-agent") ?? null,
        metadata: parsed.data,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/contact]", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
