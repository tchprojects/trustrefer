"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setFormError("");

    if (!email) {
      setEmailError("Email is required.");
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setFormError("Something went wrong. Please try again.");
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="text-center">
        <div className="mb-5 flex justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Mail size={18} className="text-white/60" />
          </div>
        </div>
        <h2 className="mb-2 text-sm font-semibold text-white">
          Check your email
        </h2>
        <p className="text-sm text-[#888]">
          If an account exists for{" "}
          <span className="text-white/70">{email}</span>, you&apos;ll receive
          a reset link shortly. It expires in 30 minutes.
        </p>
        <p className="mt-4 text-xs text-[#555]">
          Didn&apos;t receive it? Check your spam folder or{" "}
          <button
            type="button"
            onClick={() => { setSubmitted(false); setEmail(""); }}
            className="text-white/50 underline underline-offset-2 transition-colors hover:text-white"
          >
            try again
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs text-[#888]">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          placeholder="you@example.com"
          autoComplete="email"
          autoFocus
          error={emailError}
        />
      </div>

      {formError && <p className="text-xs text-red-400">{formError}</p>}

      <Button type="submit" className="w-full" loading={loading}>
        Send reset link
      </Button>

      <p className="text-center text-xs text-[#888]">
        <Link
          href="/login"
          className="text-white/50 transition-colors hover:text-white"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
