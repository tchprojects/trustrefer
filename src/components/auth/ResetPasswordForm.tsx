"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { Check, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

type TokenState = "checking" | "valid" | "invalid";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [tokenState, setTokenState] = useState<TokenState>("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    password?: string;
    confirm?: string;
    form?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passkeySupported, setPasskeySupported] = useState(false);

  // Validate token on mount
  useEffect(() => {
    if (!token) { setTokenState("invalid"); return; }

    fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((d) => setTokenState(d.valid ? "valid" : "invalid"))
      .catch(() => setTokenState("invalid"));
  }, [token]);

  // Detect passkey support
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.PublicKeyCredential !== undefined
    ) {
      setPasskeySupported(true);
    }
  }, []);

  const passwordOk = password.length >= 8;

  function validate() {
    const e: typeof errors = {};
    if (!password) e.password = "Password is required.";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters.";
    if (!confirm) e.confirm = "Please confirm your password.";
    else if (password !== confirm) e.confirm = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ form: data.error ?? "Something went wrong." });
        return;
      }

      setSuccess(true);
      // Revoke the current session cookie so the user must sign in fresh
      await signOut({ redirect: false });
    } finally {
      setLoading(false);
    }
  }

  // ---- States ----

  if (tokenState === "checking") {
    return (
      <p className="text-center text-sm text-[#555]">Verifying link…</p>
    );
  }

  if (tokenState === "invalid") {
    return (
      <div className="text-center">
        <p className="mb-2 text-sm font-semibold text-white">
          Link expired or already used
        </p>
        <p className="mb-5 text-sm text-[#888]">
          Reset links are valid for 30 minutes and can only be used once.
        </p>
        <Link
          href="/forgot-password"
          className="inline-block rounded-md border border-white/20 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-5 flex justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Check size={18} className="text-white/60" />
          </div>
        </div>
        <h2 className="mb-2 text-sm font-semibold text-white">
          Password updated
        </h2>
        <p className="mb-5 text-sm text-[#888]">
          Your password has been changed. Please sign in with your new password.
        </p>

        {passkeySupported && (
          <div className="mb-5 rounded-md border border-white/10 bg-white/[0.03] px-4 py-3 text-left">
            <div className="mb-1 flex items-center gap-2">
              <KeyRound size={13} className="text-white/50" />
              <span className="text-xs font-medium text-white/70">
                Set up a passkey for faster sign-in
              </span>
            </div>
            <p className="mb-3 text-xs text-[#555]">
              After signing in, you can add a passkey from your account
              settings to sign in with Face ID, Touch ID, or your device PIN
              — no password needed.
            </p>
          </div>
        )}

        <Button className="w-full" onClick={() => router.push("/login?reset=1")}>
          Go to sign in
        </Button>
      </div>
    );
  }

  // ---- Main form ----

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errors.form && (
        <div className="rounded-md border border-red-800/60 bg-red-950/30 px-3 py-2.5 text-xs text-red-400">
          {errors.form}
        </div>
      )}

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-xs text-[#888]"
        >
          New password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((p) => ({ ...p, password: undefined }));
          }}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          autoFocus
          error={errors.password}
        />
        {password.length > 0 && !errors.password && (
          <p
            className={`mt-1 flex items-center gap-1 text-xs ${
              passwordOk ? "text-white/50" : "text-[#555]"
            }`}
          >
            {passwordOk && <Check size={11} />}
            {passwordOk
              ? "Looks good"
              : `${8 - password.length} more character${
                  8 - password.length === 1 ? "" : "s"
                } needed`}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="confirm"
          className="mb-1.5 block text-xs text-[#888]"
        >
          Confirm password
        </label>
        <Input
          id="confirm"
          type="password"
          value={confirm}
          onChange={(e) => {
            setConfirm(e.target.value);
            setErrors((p) => ({ ...p, confirm: undefined }));
          }}
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirm}
        />
      </div>

      <Button type="submit" className="w-full" loading={loading}>
        Set new password
      </Button>
    </form>
  );
}
