"use client";

import { useState } from "react";

const REASONS = [
  { value: "expired", label: "Expired or outdated offer" },
  { value: "inaccurate", label: "Inaccurate or misleading information" },
  { value: "broken", label: "Broken link" },
  { value: "spam", label: "Spam or low-quality submission" },
  { value: "inappropriate", label: "Inappropriate or abusive content" },
  { value: "other", label: "Other" },
];

type Status = "idle" | "loading" | "success" | "error";

export function ReportForm() {
  const [reason, setReason]       = useState("");
  const [brandOrUrl, setBrandOrUrl] = useState("");
  const [details, setDetails]     = useState("");
  const [email, setEmail]         = useState("");
  const [status, setStatus]       = useState<Status>("idle");
  const [errorMsg, setErrorMsg]   = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason || !brandOrUrl.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, brandOrUrl: brandOrUrl.trim(), details, email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-green-900/50 bg-green-950/20 px-5 py-6 text-center">
        <p className="text-sm font-medium text-green-400">Report submitted — thank you.</p>
        <p className="mt-1 text-xs text-[#666]">
          We&apos;ll review your report and take action where needed.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Reason */}
      <div className="space-y-1.5">
        <label htmlFor="reason" className="block text-xs font-medium text-[#999]">
          Reason for report <span className="text-red-400">*</span>
        </label>
        <select
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
        >
          <option value="">Select a reason…</option>
          {REASONS.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Brand / URL */}
      <div className="space-y-1.5">
        <label htmlFor="brandOrUrl" className="block text-xs font-medium text-[#999]">
          Brand name or link URL <span className="text-red-400">*</span>
        </label>
        <input
          id="brandOrUrl"
          type="text"
          value={brandOrUrl}
          onChange={(e) => setBrandOrUrl(e.target.value)}
          placeholder="e.g. Octopus Energy, or https://…"
          required
          maxLength={300}
          className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#333] focus:border-white/30 focus:outline-none"
        />
      </div>

      {/* Details */}
      <div className="space-y-1.5">
        <label htmlFor="details" className="block text-xs font-medium text-[#999]">
          Additional details{" "}
          <span className="text-[#444]">(optional)</span>
        </label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Describe what you found…"
          rows={4}
          maxLength={1000}
          className="w-full resize-none rounded-md border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#333] focus:border-white/30 focus:outline-none"
        />
        <p className="text-right text-[10px] text-[#444]">{details.length} / 1000</p>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-xs font-medium text-[#999]">
          Your email{" "}
          <span className="text-[#444]">(optional — only used for follow-up)</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          maxLength={200}
          className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder-[#333] focus:border-white/30 focus:outline-none"
        />
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="rounded-md border border-red-900/50 bg-red-950/20 px-3 py-2 text-xs text-red-400">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading" || !reason || !brandOrUrl.trim()}
        className="w-full rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "loading" ? "Submitting…" : "Submit report"}
      </button>
    </form>
  );
}
