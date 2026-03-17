"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toaster";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const passwordOk = password.length >= 8;

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
      setErrors({ form: data.error ?? "Registration failed. Please try again." });
    } else {
      toast("Account created! Please sign in.");
      router.push("/login?registered=1");
    }
  }

  return (
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
          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: undefined })); }}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
        />
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

      <p className="text-center text-xs text-[#888]">
        Already have an account?{" "}
        <Link href="/login" className="text-white transition-colors hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
