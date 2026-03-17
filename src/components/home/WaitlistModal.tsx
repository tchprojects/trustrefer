"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface WaitlistModalProps {
  linkId: string | null;
  onClose: () => void;
}

export function WaitlistModal({ linkId, onClose }: WaitlistModalProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId }),
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
    setDone(false);
    setError(null);
    onClose();
  }

  return (
    <Dialog.Root open={!!linkId} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl animate-in fade-in-0 zoom-in-95">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold text-white">
              Join waitlist
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
              <p className="text-sm text-white">You&apos;re on the waitlist.</p>
              <p className="mt-1 text-xs text-[#888]">
                We&apos;ll reach out when a referral spot opens up.
              </p>
              <Button size="sm" variant="secondary" className="mt-4" onClick={handleClose}>
                Close
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[#888]">
                Join the waitlist for this brand&apos;s referral link. You&apos;ll be notified
                when a spot becomes available — first come, first served.
              </p>

              {error && <p className="text-xs text-red-400">{error}</p>}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
                  Cancel
                </Button>
                <Button size="sm" loading={loading} onClick={handleJoin}>
                  Join waitlist
                </Button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
