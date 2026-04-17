import { Suspense } from "react";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Set new password — TrustRefer",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-semibold text-white">
            TrustRefer
          </Link>
          <p className="mt-2 text-sm text-[#888]">Set a new password</p>
        </div>

        <div className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-6">
          {/* Suspense required because ResetPasswordForm uses useSearchParams */}
          <Suspense
            fallback={
              <p className="text-center text-sm text-[#555]">Loading…</p>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
