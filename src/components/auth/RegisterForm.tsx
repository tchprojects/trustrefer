"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toaster";
import { PLANS, PLAN_SLUG_TO_TIER, type PlanSlug } from "@/lib/pricing";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

interface RegisterFormProps {
  plan?: string; // URL slug: "standard" | "pro"
}

export function RegisterForm({ plan }: RegisterFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const passwordOk = password.length >= 8;

  const validSlug: PlanSlug | null =
    plan === "standard" || plan === "pro" ? plan : null;

  // Where to land after Google OAuth completes
  const postAuthUrl = validSlug ? `/checkout?plan=${validSlug}` : "/";

  const planLabel = validSlug
    ? PLANS[PLAN_SLUG_TO_TIER[validSlug]].name
    : null;

  function validate() {
    const e: typeof errors = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email) e.email = "Email is required.";
    else if (!isValidEmail(email)) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 8) e.password = "Password must be at least 8 characters.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (res.status === 409) {
        setEmailExists(true);
      } else {
        setErrors({ form: data.error ?? "Registration failed. Please try again." });
      }
    } else {
      toast("Account created! Please sign in.");
      // Carry plan through to login page
      // Always carry a plan through — "free" triggers the welcome+upgrade prompt
      const loginUrl = `/login?registered=1&plan=${validSlug ?? "free"}`;
      router.push(loginUrl);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: postAuthUrl });
  }

  return (
    <div className="space-y-4">
      {/* Plan intent banner */}
      {planLabel && (
        <div className="rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#888]">
          You selected the{" "}
          <span className="font-medium text-white">{planLabel}</span> plan.
          Create an account to continue to payment.
        </div>
      )}

      {/* Google sign-up */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
        className="flex w-full items-center justify-center gap-2.5 rounded-md border border-white/10 bg-white/5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
      >
        <GoogleIcon />
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-[#555]">or</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs text-[#888]">
            Name
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
            placeholder="Your name"
            autoComplete="name"
            error={errors.name}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-xs text-[#888]">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((p) => ({ ...p, email: undefined }));
              setEmailExists(false);
            }}
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email}
          />
          {emailExists && (
            <p className="mt-1.5 text-xs text-yellow-400">
              An account with this email already exists.{" "}
              <Link
                href={validSlug ? `/login?plan=${validSlug}` : "/login"}
                className="underline underline-offset-2 hover:text-white"
              >
                Sign in instead
              </Link>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-xs text-[#888]">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password}
          />
          {password.length > 0 && !errors.password && (
            <p className={`mt-1 flex items-center gap-1 text-xs ${passwordOk ? "text-white/50" : "text-[#555]"}`}>
              {passwordOk && <Check size={11} />}
              {passwordOk ? "Looks good" : `${8 - password.length} more character${8 - password.length === 1 ? "" : "s"} needed`}
            </p>
          )}
        </div>

        {errors.form && <p className="text-xs text-red-400">{errors.form}</p>}

        <Button type="submit" className="w-full" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="text-center text-xs text-[#888]">
        Already have an account?{" "}
        <Link
          href={validSlug ? `/login?plan=${validSlug}` : "/login"}
          className="text-white transition-colors hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
