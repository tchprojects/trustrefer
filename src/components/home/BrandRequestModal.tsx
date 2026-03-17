"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface BrandRequestModalProps {
  categoryId: string | null;
  onClose: () => void;
}

export function BrandRequestModal({ categoryId, onClose }: BrandRequestModalProps) {
  const [brandName, setBrandName] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!brandName.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/brand-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, brandName, note }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Something went wrong.");
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setBrandName("");
    setNote("");
    setDone(false);
    setError(null);
    onClose();
  }

  return (
    <Dialog.Root open={!!categoryId} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl animate-in fade-in-0 zoom-in-95">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold text-white">
              Request a new brand
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="flex h-6 w-6 items-center justify-center rounded text-[#555] transition-colors hover:bg-white/5 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          {done ? (
            <div className="py-6 text-center">
              <CheckCircle2 size={24} className="mx-auto mb-3 text-white/60" />
              <p className="text-sm text-white">Request submitted.</p>
              <p className="mt-1 text-xs text-[#888]">We&apos;ll review it and add it if approved.</p>
              <Button size="sm" variant="secondary" className="mt-4" onClick={handleClose}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-[#888]">Brand name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  maxLength={100}
                  placeholder="e.g. TopCashback"
                  className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-[#555] focus:border-white/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-[#888]">
                  Note <span className="text-[#444]">(optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder="Any additional details about this brand…"
                  className="w-full resize-none rounded-md border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-[#555] focus:border-white/40 focus:outline-none"
                />
              </div>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" loading={loading} disabled={!brandName.trim()}>
                  Submit request
                </Button>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
