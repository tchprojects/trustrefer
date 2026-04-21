import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign in — TrustRefer",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; registered?: string }>;
}) {
  const { plan, registered } = await searchParams;
  const validPlan = plan === "standard" || plan === "pro" ? plan : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-semibold text-white">
            TrustRefer
          </Link>
          <p className="mt-2 text-sm text-[#888]">Sign in to your account</p>
        </div>

        {registered && (
          <div className="mb-4 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#888]">
            Account created — sign in to continue.
          </div>
        )}

        <div className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-6">
          <LoginForm plan={validPlan} />
        </div>
      </div>
    </div>
  );
}
