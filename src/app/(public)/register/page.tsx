import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register — TrustRefer",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-xl font-semibold text-white">
            TrustRefer
          </Link>
          <p className="mt-2 text-sm text-[#888]">Create a free account</p>
        </div>

        <div className="rounded-md border border-[#1f1f1f] bg-[#0a0a0a] p-6">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
