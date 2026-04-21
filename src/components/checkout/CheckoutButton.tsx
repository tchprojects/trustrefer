"use client";

import { useState } from "react";

interface CheckoutButtonProps {
  plan: "STARTER" | "PREMIUM";
  planName: string;
}

export function CheckoutButton({ plan, planName }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full rounded-md bg-white py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Redirecting to payment…" : `Pay for ${planName}`}
      </button>
      {error && <p className="text-center text-xs text-red-400">{error}</p>}
    </div>
  );
}
