"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toaster";

interface Category {
  id: string;
  name: string;
}

interface SubmitFormProps {
  categories: Category[];
}

export function SubmitForm({ categories }: SubmitFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [brandName, setBrandName] = useState("");
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ brandName?: string; url?: string; form?: string }>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!brandName.trim()) e.brandName = "Brand name is required.";
    if (!url) e.url = "URL is required.";
    else if (!/^https?:\/\/.+/.test(url)) e.url = "URL must start with https:// or http://";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandName, url, categoryId, note }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErrors({ form: data.error ?? "Submission failed." });
    } else {
      toast("Submitted for review!");
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm font-medium text-white">Submission received!</p>
        <p className="mt-2 text-xs text-[#888]">
          Our team will review your link. You&apos;ll see it appear once approved.
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Button size="sm" variant="secondary" onClick={() => router.push("/")}>
            Back to directory
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSuccess(false);
              setBrandName("");
              setUrl("");
              setNote("");
            }}
          >
            Submit another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="category" className="mb-1.5 block text-xs text-[#888]">
          Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-md border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="brandName" className="text-xs text-[#888]">
            Brand name
          </label>
          <span className="text-xs text-[#444]">{brandName.length}/100</span>
        </div>
        <Input
          id="brandName"
          value={brandName}
          onChange={(e) => { setBrandName(e.target.value); setErrors((p) => ({ ...p, brandName: undefined })); }}
          placeholder="e.g. Octopus Energy"
          maxLength={100}
          error={errors.brandName}
        />
      </div>

      <div>
        <label htmlFor="url" className="mb-1.5 block text-xs text-[#888]">
          Referral URL
        </label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setErrors((p) => ({ ...p, url: undefined })); }}
          placeholder="https://…"
          error={errors.url}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="note" className="text-xs text-[#888]">
            Note <span className="text-[#444]">(optional)</span>
          </label>
          <span className="text-xs text-[#444]">{note.length}/500</span>
        </div>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Any context for the reviewer…"
          className="w-full resize-none rounded-md border border-[#1f1f1f] bg-[#0a0a0a] px-3 py-2 text-sm text-white placeholder:text-[#555] focus:border-white/40 focus:outline-none"
        />
      </div>

      {errors.form && <p className="text-xs text-red-400">{errors.form}</p>}

      <Button type="submit" className="w-full" loading={loading}>
        Submit for review
      </Button>
    </form>
  );
}
