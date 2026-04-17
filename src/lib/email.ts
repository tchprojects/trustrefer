interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions): Promise<void> {
  // Never send real emails in local development — just log to console
  if (process.env.NODE_ENV !== "production") {
    console.log("\n[EMAIL DEV — not sent]");
    console.log("To:", to);
    console.log("Subject:", subject);
    console.log("Body:\n", text, "\n");
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "TrustRefer <noreply@trustrefer.co.uk>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Email delivery failed (${res.status}): ${body}`);
  }
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

const BASE_STYLES = `
  body{background:#0a0a0a;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;margin:0;padding:0}
  .wrap{max-width:480px;margin:40px auto;padding:32px;background:#111;border:1px solid #1f1f1f;border-radius:8px}
  .logo{font-size:18px;font-weight:600;color:#fff;margin-bottom:24px;letter-spacing:-0.3px}
  h1{font-size:16px;font-weight:600;color:#fff;margin:0 0 10px}
  p{color:#888;font-size:14px;line-height:1.65;margin:0 0 16px}
  .btn{display:inline-block;background:#fff;color:#000;text-decoration:none;padding:11px 22px;border-radius:6px;font-weight:500;font-size:14px;margin-bottom:20px}
  .divider{border:none;border-top:1px solid #1f1f1f;margin:20px 0}
  .meta{font-size:12px;color:#555;word-break:break-all}
  .alert{background:#180a0a;border:1px solid #3d1515;border-radius:6px;padding:13px 16px;margin-bottom:16px}
  .alert p{color:#f87171;margin:0;font-size:13px}
`.replace(/\n\s*/g, "");

export function resetPasswordEmailHtml(resetUrl: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Reset your TrustRefer password</title><style>${BASE_STYLES}</style></head><body>
<div class="wrap">
  <div class="logo">TrustRefer</div>
  <h1>Reset your password</h1>
  <p>We received a request to reset the password for your TrustRefer account. Click the button below to choose a new password. This link is valid for <strong style="color:#fff">30 minutes</strong> and can only be used once.</p>
  <a href="${resetUrl}" class="btn">Reset password</a>
  <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
  <hr class="divider"/>
  <p class="meta">If the button doesn't work, paste this URL into your browser:<br/>${resetUrl}</p>
</div>
</body></html>`;
}

export function resetPasswordEmailText(resetUrl: string): string {
  return [
    "TrustRefer — Reset your password",
    "",
    "We received a request to reset the password for your TrustRefer account.",
    "Click the link below to choose a new password (valid for 30 minutes, one-time use):",
    "",
    resetUrl,
    "",
    "If you didn't request this, you can safely ignore this email.",
  ].join("\n");
}

export function passwordChangedEmailHtml(name: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Your TrustRefer password was changed</title><style>${BASE_STYLES}</style></head><body>
<div class="wrap">
  <div class="logo">TrustRefer</div>
  <h1>Your password was changed</h1>
  <p>Hi ${name || "there"},</p>
  <p>The password for your TrustRefer account was successfully changed.</p>
  <div class="alert">
    <p>If you did not make this change, <a href="mailto:support@trustrefer.co.uk" style="color:#f87171">contact support immediately</a> — your account may be compromised.</p>
  </div>
  <p style="color:#555;font-size:12px;margin:0">This is an automated security notification. Please do not reply to this email.</p>
</div>
</body></html>`;
}

export function passwordChangedEmailText(name: string): string {
  return [
    "TrustRefer — Your password was changed",
    "",
    `Hi ${name || "there"},`,
    "",
    "The password for your TrustRefer account was successfully changed.",
    "",
    "If you did not make this change, contact support immediately at support@trustrefer.co.uk",
    "as your account may be compromised.",
  ].join("\n");
}
