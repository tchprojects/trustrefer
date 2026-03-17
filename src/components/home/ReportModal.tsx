"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface ReportModalProps {
  linkId: string | null;
  onClose: () => void;
}

export function ReportModal({ linkId, onClose }: ReportModalProps) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId, note }),
      });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      setDone(true);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setNote("");
    setDone(false);
    onClose();
  }

  return (
    <Dialog.Root open={!!linkId} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-[#0a0a0a] p-5 shadow-2xl animate-in fade-in-0 zoom-in-95">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-sm font-semibold text-white">
              Report an issue
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
              <p className="text-sm text-white">Thanks for your report.</p>
              <p className="mt-1 text-xs text-[#888]">Our team will review it shortly.</p>
              <Button size="sm" variant="secondary" className="mt-4" onClick={handleClose}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs text-[#888]">
                  Describe the issue
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  maxLength={500}
                  placeholder="What's wrong with this link?"
                  className="w-full resize-none rounded-md border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-[#555] focus:border-white/40 focus:outline-none"
                />
                <p className="mt-1 text-right text-[11px] text-[#444]">
                  {note.length}/500
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" loading={loading} disabled={!note.trim()}>
                  Submit
                </Button>
              </div>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
