import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendEmail,
  resetPasswordEmailHtml,
  resetPasswordEmailText,
} from "@/lib/email";
import crypto from "crypto";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 3;                      // max requests per window per email
const TOKEN_EXPIRY_MS = 30 * 60 * 1000;        // 30 minutes

// Always return this — never reveal whether an account exists
const GENERIC_OK = () =>
  NextResponse.json({
    message:
      "If an account exists for that email, you'll receive a reset link shortly.",
  });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return GENERIC_OK();

  const email = parsed.data.email.toLowerCase().trim();
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const ua = req.headers.get("user-agent") ?? undefined;

  // Look up account — silently skip if not found or OAuth-only (no password)
  const user = await prisma.user
    .findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    })
    .catch(() => null);

  // Audit every attempt regardless of outcome
  await prisma.auditLog
    .create({
      data: {
        userId: user?.id ?? null,
        action: "password_reset_requested",
        ip,
        userAgent: ua,
        metadata: { email },
      },
    })
    .catch(() => {});

  // No account or OAuth-only account — return generic response
  if (!user?.password) return GENERIC_OK();

  // Rate limit: max RATE_LIMIT_MAX tokens per email in the window
  const recentCount = await prisma.passwordResetToken.count({
    where: {
      userId: user.id,
      createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) },
    },
  });
  if (recentCount >= RATE_LIMIT_MAX) return GENERIC_OK();

  // Generate a crypto-secure token; store only its SHA-256 hash
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + TOKEN_EXPIRY_MS),
    },
  });

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://trustrefer.co.uk";
  const resetUrl = `${appUrl}/reset-password?token=${rawToken}`;

  // In development always print the link so you can test without a verified domain
  if (process.env.NODE_ENV === "development") {
    console.log("\n[DEV] Password reset URL for", user.email);
    console.log(resetUrl, "\n");
  }

  await sendEmail({
    to: user.email,
    subject: "Reset your TrustRefer password",
    html: resetPasswordEmailHtml(resetUrl),
    text: resetPasswordEmailText(resetUrl),
  }).catch((err) => {
    console.error("[forgot-password] email send failed:", err?.message ?? err);
  });

  return GENERIC_OK();
}
