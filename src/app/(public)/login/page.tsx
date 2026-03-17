import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign in — TrustRefer",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-semibold text-white">
            TrustRefer
          </Link>
          <p className="mt-2 text-sm text-[#888]">Sign in to your account</p>
        </div>

        <div className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
