import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendEmail,
  passwordChangedEmailHtml,
  passwordChangedEmailText,
} from "@/lib/email";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(64).max(64), // 32 bytes hex = 64 chars
  password: z.string().min(8).max(100),
});

function hashToken(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

// ---------------------------------------------------------------------------
// GET — validate token before showing the form (no side-effects)
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("token") ?? "";
  if (!raw) return NextResponse.json({ valid: false });

  const record = await prisma.passwordResetToken
    .findUnique({
      where: { tokenHash: hashToken(raw) },
      select: { expiresAt: true, usedAt: true },
    })
    .catch(() => null);

  const valid =
    !!record && !record.usedAt && record.expiresAt > new Date();

  return NextResponse.json({ valid });
}

// ---------------------------------------------------------------------------
// POST — execute the password change
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { token: rawToken, password } = parsed.data;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? undefined;

  const record = await prisma.passwordResetToken
    .findUnique({
      where: { tokenHash: hashToken(rawToken) },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    })
    .catch(() => null);

  if (!record) {
    return NextResponse.json(
      { error: "Invalid or expired reset link." },
      { status: 400 }
    );
  }

  // Token already used — possible replay attempt
  if (record.usedAt) {
    await prisma.auditLog
      .create({
        data: {
          userId: record.userId,
          action: "password_reset_replay_attempt",
          ip,
          userAgent: ua,
        },
      })
      .catch(() => {});
    return NextResponse.json(
      { error: "This reset link has already been used." },
      { status: 400 }
    );
  }

  if (record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "This reset link has expired. Please request a new one." },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const now = new Date();

  await prisma.$transaction([
    // 1. Update password + stamp passwordChangedAt (invalidates future JWT checks)
    prisma.user.update({
      where: { id: record.userId },
      data: { password: hashedPassword, passwordChangedAt: now },
    }),
    // 2. Mark this token as used (single-use enforcement)
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: now },
    }),
    // 3. Burn all other unused tokens for this user
    prisma.passwordResetToken.updateMany({
      where: { userId: record.userId, id: { not: record.id }, usedAt: null },
      data: { usedAt: now },
    }),
    // 4. Audit trail
    prisma.auditLog.create({
      data: {
        userId: record.userId,
        action: "password_reset_completed",
        ip,
        userAgent: ua,
      },
    }),
  ]);

  // Fire-and-forget security notification
  sendEmail({
    to: record.user.email,
    subject: "Your TrustRefer password was changed",
    html: passwordChangedEmailHtml(record.user.name ?? ""),
    text: passwordChangedEmailText(record.user.name ?? ""),
  }).catch((err) => {
    console.error("[reset-password] notification email failed:", err);
  });

  return NextResponse.json({ success: true });
}
